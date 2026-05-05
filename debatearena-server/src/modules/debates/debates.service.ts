import { DebatesRepository } from './debates.repository';
import { SessionsRepository } from '../sessions/sessions.repository';
import { ForbiddenError, NotFoundError, ConflictError } from '../../utils/errors';
import { env } from '../../config/env';
import { Queue } from 'bullmq';
import { GoogleGenAI } from '@google/genai';
import prisma from '../../config/database';
import { EndReason } from '@prisma/client';

export const verdictQueue = new Queue('verdictJobs', {
  connection: {
    host: new URL(env.REDIS_URL).hostname,
    port: parseInt(new URL(env.REDIS_URL).port || '6379')
  }
});

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export class DebatesService {
  constructor(
    private debatesRepository: DebatesRepository,
    private sessionsRepository: SessionsRepository
  ) {}

  async sendMessage(userId: string, sessionId: string, content: string) {
    const participant = await this.debatesRepository.findParticipant(sessionId, userId);
    if (!participant) throw new ForbiddenError('Not a participant in this debate', 'NOT_PARTICIPANT');

    const activeRound = await this.debatesRepository.findActiveRound(sessionId);
    if (!activeRound) throw new ConflictError('There is no active round at the moment', 'NO_ACTIVE_ROUND');

    if (activeRound.activeParticipantId !== participant.id) {
      throw new ForbiddenError('It is not your turn to speak', 'NOT_YOUR_TURN');
    }

    const wordCount = content.trim().split(/\s+/).length;

    let isFlagged = false;
    try {
      const prompt = `You are a real-time debate moderator. Analyze this message for extreme hate speech, illegal content, or severe personal attacks. 
      Respond ONLY with valid JSON: {"flagged": boolean}.
      Message: "${content}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const match = text.match(/\{.*\}/s);
      if (match) {
        const result = JSON.parse(match[0]);
        isFlagged = result.flagged;
      }
    } catch (e) {
      console.error('Moderation failed, continuing without flag.', e);
    }

    if (isFlagged) {
      await prisma.user.update({
        where: { id: userId },
        data: { warningCount: { increment: 1 } }
      });
    }

    const message = await this.debatesRepository.createMessage({
      sessionId,
      roundId: activeRound.id,
      participantId: participant.id,
      content,
      wordCount,
      isFlagged
    });

    return message;
  }

  async handleTurnEnd(sessionId: string, roundId: string) {
    const round = await this.debatesRepository.findRound(roundId);
    if (!round || round.status !== 'active') return null;

    await this.debatesRepository.markRoundCompleted(roundId);
    const nextRound = await this.debatesRepository.activateNextRound(sessionId, round.roundNumber);

    if (!nextRound) {
      await this.endDebate(sessionId, 'completed');
    }

    return nextRound;
  }

  async handleTimeout(sessionId: string, roundId: string) {
    const round = await this.debatesRepository.findRound(roundId);
    if (!round || round.status !== 'active') return null;

    await this.debatesRepository.markRoundCompleted(roundId, true);
    const nextRound = await this.debatesRepository.activateNextRound(sessionId, round.roundNumber);

    if (!nextRound) {
      await this.endDebate(sessionId, 'completed');
    }

    return nextRound;
  }

  async endDebate(sessionId: string, reason: EndReason) {
    await this.sessionsRepository.setEndedAt(sessionId, reason);

    await verdictQueue.add('generateVerdict', { sessionId });

    const participants = await prisma.sessionParticipant.findMany({
      where: { sessionId },
      include: { user: true }
    });

    for (const p of participants) {
      await prisma.sessionParticipant.update({
        where: { id: p.id },
        data: { eloBefore: p.user.globalElo }
      });
    }

  }

  async concede(userId: string, sessionId: string) {
    const participant = await this.debatesRepository.findParticipant(sessionId, userId);
    if (!participant) throw new ForbiddenError('Not a participant', 'NOT_PARTICIPANT');

    await prisma.sessionParticipant.update({
      where: { id: participant.id },
      data: { conceded: true }
    });

    await this.endDebate(sessionId, 'conceded');
  }

  async requestExtension(userId: string, sessionId: string) {
    const participant = await this.debatesRepository.findParticipant(sessionId, userId);
    if (!participant) throw new ForbiddenError('Not a participant', 'NOT_PARTICIPANT');

    if (participant.extensionsUsed >= 1) {
      throw new ConflictError('You have already used your 1 time extension', 'EXTENSION_USED');
    }

    const activeRound = await this.debatesRepository.findActiveRound(sessionId);
    if (!activeRound) throw new ConflictError('No active round', 'NO_ACTIVE_ROUND');

    if (activeRound.activeParticipantId !== participant.id) {
      throw new ForbiddenError('It is not your turn', 'NOT_YOUR_TURN');
    }

    await prisma.sessionParticipant.update({
      where: { id: participant.id },
      data: { extensionsUsed: { increment: 1 } }
    });

    const updatedRound = await prisma.debateRound.update({
      where: { id: activeRound.id },
      data: { turnDurationSeconds: { increment: 120 } }
    });

    return { addedSeconds: 120, newDuration: updatedRound.turnDurationSeconds };
  }
}
