import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';
import { AiRepository } from './ai.repository';
import { BadRequestError } from '../../utils/errors';
import { FactCheckVerdict } from '@prisma/client';
import logger from '../../config/logger';

export class AiService {
  private client: GoogleGenAI;

  constructor(private aiRepository: AiRepository) {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  async factCheck(sessionId: string, userId: string, claimText: string, messageId?: string) {
    const participant = await this.aiRepository.findParticipant(sessionId, userId);

    if (!participant) {
      throw new BadRequestError('Participant not found in this session');
    }

    if (participant.factChecksUsed >= 3) {
      throw new BadRequestError('Fact-check limit reached (3 per debate)', 'RATE_LIMIT_REACHED');
    }

    // 1. Create pending row
    const factCheckRow = await this.aiRepository.createFactCheck({
      sessionId,
      requestedBy: participant.id,
      messageId,
      claimText,
    });

    const startTime = Date.now();

    try {
      // 2. Call Gemini — response.text is a string property on the response object
      const prompt = this.buildFactCheckPrompt(claimText);
      const response = await this.client.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const aiData = JSON.parse(response.text!);

      // 3. Update row with result
      const completedFactCheck = await this.aiRepository.updateFactCheck(factCheckRow.id, {
        verdict: aiData.verdict as FactCheckVerdict,
        explanation: aiData.explanation,
        sources: aiData.sources,
        processingMs: Date.now() - startTime,
        completedAt: new Date(),
      });

      // 4. Increment usage counter
      await this.aiRepository.incrementFactChecksUsed(participant.id);

      return completedFactCheck;
    } catch (error) {
      logger.error('Fact check AI error:', error);
      throw error;
    }
  }

  async research(sessionId: string, userId: string, queryText: string) {
    const participant = await this.aiRepository.findParticipant(sessionId, userId);

    if (!participant) {
      throw new BadRequestError('Participant not found in this session');
    }

    if (participant.researchQueriesUsed >= 5) {
      throw new BadRequestError('Research limit reached (5 per debate)', 'RATE_LIMIT_REACHED');
    }

    const startTime = Date.now();

    try {
      // 1. Call Gemini — response.text is a string property on the response object
      const prompt = this.buildResearchPrompt(queryText);
      const response = await this.client.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const aiData = JSON.parse(response.text!);

      // 2. Persist result and increment usage counter
      const researchQuery = await this.aiRepository.createResearchQuery({
        sessionId,
        requestedBy: participant.id,
        queryText,
        responseText: aiData.declined ? null : aiData.response,
        sources: aiData.declined ? null : aiData.sources,
        wasDeclined: aiData.declined || false,
        declinedReason: aiData.declined ? aiData.reason : null,
        processingMs: Date.now() - startTime,
        completedAt: new Date(),
      });

      await this.aiRepository.incrementResearchQueriesUsed(participant.id);

      return researchQuery;
    } catch (error) {
      logger.error('Research AI error:', error);
      throw error;
    }
  }

  private buildFactCheckPrompt(claimText: string): string {
    return `
      You are an expert fact-checker for a high-stakes debate arena.
      Analyze the following claim and provide a verdict.
      
      Claim: "${claimText}"
      
      Instructions:
      - Verdict must be one of: "supported", "disputed", "unverifiable".
      - Explanation should be concise (max 2 sentences).
      - Provide up to 3 reliable sources with title and URL.
      
      Return ONLY a JSON object in this format:
      {
        "verdict": "supported" | "disputed" | "unverifiable",
        "explanation": "string",
        "sources": [{ "title": "string", "url": "string" }]
      }
    `;
  }

  private buildResearchPrompt(queryText: string): string {
    return `
      You are a neutral research assistant for a debate.
      Answer the following research query with objective facts and data.
      
      Query: "${queryText}"
      
      Instructions:
      - If the question asks for your opinion, asks which option is better, or is subjective, set "declined" to true and provide a reason.
      - Otherwise, set "declined" to false, provide a neutral response, and include reliable sources.
      
      Return ONLY a JSON object in this format:
      {
        "declined": boolean,
        "reason": "string | null",
        "response": "string | null",
        "sources": [{ "title": "string", "url": "string" }]
      }
    `;
  }
}
