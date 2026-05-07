import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { VerdictsRepository } from '../modules/verdicts/verdicts.repository';
import { DebatesRepository } from '../modules/debates/debates.repository';
import { io } from '../server';
import { eloQueue, badgeQueue } from '../queues';
import logger from '../config/logger';
import { Criterion } from '@prisma/client';
import { callGroq } from '../utils/ai';

const verdictsRepository = new VerdictsRepository();
const debatesRepository = new DebatesRepository();

export const verdictWorker = new Worker('verdictJobs', async (job: Job) => {
  const { sessionId } = job.data;
  const startTime = Date.now();

  try {
    logger.info(`[VerdictWorker] Starting verdict generation for session: ${sessionId}`);

    const session = await verdictsRepository.findFullSession(sessionId);
    if (!session) throw new Error('Session not found');

    const messages = await debatesRepository.getTranscript(sessionId);
    const questions = ((session as any).questions as string[]) || [];

    let transcript = `DEBATE MAIN TOPIC: ${session.title}\n`;
    transcript += `CATEGORY: ${session.category.name}\n\n`;

    for (const p of session.participants) {
      transcript += `PARTICIPANT: ${p.user.username} | STANCE: ${p.stance} | ID: ${p.id}\n`;
    }
    transcript += `\n--- POINT-BY-POINT COMPARISON ---\n\n`;

    questions.forEach((q, index) => {
      const roundNumber = index + 1;
      transcript += `QUESTION ${roundNumber}: ${q}\n`;
      
      const roundMessages = messages.filter(m => m.round.roundNumber === roundNumber);
      
      for (const p of session.participants) {
        const pMsg = roundMessages.find(m => m.participantId === p.id);
        transcript += `[${p.user.username}'s Answer]: ${pMsg ? pMsg.content : 'No answer submitted.'}\n`;
      }
      transcript += `\n`;
    });

    const prompt = `
      You are a professional, neutral debate judge. 
      Analyze the provided debate transcript and score each participant based on their performance.
      
      CRITERIA (Score 1-10):
      - clarity: How clear and articulate were their points?
      - logic: How sound was their reasoning and structure?
      - evidence: How well did they use facts, data, or the provided fact-check/research results?
      - responsiveness: How well did they address the opponent's points (rebuttals)?
      - consistency: Did they stay on message and maintain their stance?

      ${transcript}

      INSTRUCTIONS:
      - Be objective and critical.
      - Return ONLY valid JSON.
      - Analyze how well each participant answered the 5 specific sub-questions provided.
      - If one participant was clearly superior across most points, declare them winner. 
      - If total scores are within 3 points of each other, declare a tie.
      - Summary should be a structured breakdown of who won each of the 5 points and why, plus an overall conclusion.

      JSON FORMAT:
      {
        "scores": {
          "PARTICIPANT_ID": {
            "clarity": { "score": number, "explanation": "string" },
            "logic": { "score": number, "explanation": "string" },
            "evidence": { "score": number, "explanation": "string" },
            "responsiveness": { "score": number, "explanation": "string" },
            "consistency": { "score": number, "explanation": "string" }
          }
        },
        "summary": "string",
        "winnerId": "string or null",
        "isTie": boolean
      }
    `;

    const text = await callGroq(prompt, true);
    const aiData = JSON.parse(text);

    let finalWinnerId = aiData.winnerId;
    let finalIsTie = aiData.isTie;

    const concession = session.participants.find(p => p.conceded);
    if (concession) {
      const other = session.participants.find(p => p.id !== concession.id);
      finalWinnerId = other?.id || null;
      finalIsTie = false;
      logger.info(`[VerdictWorker] Concession detected. Overriding winner to: ${finalWinnerId}`);
    }

    const verdict = await verdictsRepository.createVerdict({
      sessionId,
      winnerParticipantId: finalWinnerId,
      isTie: finalIsTie,
      summary: aiData.summary,
      processingMs: Date.now() - startTime
    });

    const scoreData: any[] = [];
    for (const [pId, criteria] of Object.entries(aiData.scores)) {
      for (const [criterion, val] of Object.entries(criteria as any)) {
        scoreData.push({
          verdictId: verdict.id,
          participantId: pId,
          criterion: criterion as Criterion,
          score: (val as any).score,
          explanation: (val as any).explanation
        });
      }
    }
    await verdictsRepository.createVerdictScores(scoreData);

    io.to(`session:${sessionId}`).emit('verdict:ready', {
      verdictId: verdict.id,
      winnerId: finalWinnerId,
      isTie: finalIsTie,
      summary: aiData.summary
    });

    await eloQueue.add('calculateElo', { sessionId });
    await badgeQueue.add('checkBadges', { sessionId });

    logger.info(`[VerdictWorker] Completed verdict for session: ${sessionId}`);

  } catch (error) {
    logger.error(`[VerdictWorker] Error processing job ${job.id}:`, error);
    throw error;
  }
}, {
  connection: {
    host: new URL(env.REDIS_URL).hostname,
    port: parseInt(new URL(env.REDIS_URL).port || '6379'),
  }
});
