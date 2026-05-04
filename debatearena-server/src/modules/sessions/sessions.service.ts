import { GoogleGenAI } from '@google/genai';
import { SessionsRepository } from './sessions.repository';
import { generateInviteCode } from '../../utils/inviteCode';
import { ForbiddenError, NotFoundError, ConflictError } from '../../utils/errors';
import prisma from '../../config/database';
import { SessionFormat, SessionVisibility } from '@prisma/client';
import { env } from '../../config/env';
import { Queue } from 'bullmq';

// Initialize a BullMQ queue to handle expiring sessions that no one joins
export const sessionExpiryQueue = new Queue('sessionExpiry', {
  connection: {
    host: new URL(env.REDIS_URL).hostname,
    port: parseInt(new URL(env.REDIS_URL).port || '6379')
  }
});

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export class SessionsService {
  constructor(private sessionsRepository: SessionsRepository) {}

  async screenTopic(title: string): Promise<{ flagged: boolean; reason: string | null }> {
    try {
      const prompt = `You are an automated moderation system for a debate platform. 
      Analyze this debate topic title and determine if it violates community guidelines (hate speech, illegal acts, explicit content, extreme violence).
      Respond ONLY with valid JSON in this exact format: {"flagged": boolean, "reason": "string or null"}.
      
      Topic: "${title}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{.*\}/s);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { flagged: false, reason: null };
    } catch (error) {
      console.error('AI Screening failed, bypassing for development', error);
      return { flagged: false, reason: null };
    }
  }

  async createSession(userId: string, data: any) {
    const { title, creatorStance, format, visibility, categoryId } = data;

    const screenResult = await this.screenTopic(title);
    if (screenResult.flagged) {
      throw new ForbiddenError(`Topic flagged by moderation: ${screenResult.reason}`, 'TOPIC_FLAGGED');
    }

    let inviteCode = null;
    if (visibility === 'invite_only') {
      inviteCode = await generateInviteCode();
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    let totalRounds = 5;
    if (format === 'quick') totalRounds = 3;
    if (format === 'extended') totalRounds = 8;

    const sessionData = {
      title,
      creatorId: userId,
      categoryId,
      creatorStance,
      format: format as SessionFormat,
      visibility: visibility as SessionVisibility,
      inviteCode,
      totalRounds,
      expiresAt,
      participants: {
        create: {
          userId,
          role: 'creator',
          stance: creatorStance
        }
      }
    };

    const session = await this.sessionsRepository.createSession(sessionData as any);

    await sessionExpiryQueue.add('expireSession', { sessionId: session.id }, {
      delay: 2 * 60 * 60 * 1000 
    });

    return session;
  }

  async joinSession(userId: string, sessionId: string, stance: string) {
    const session = await this.sessionsRepository.findById(sessionId);
    
    if (!session) {
      throw new NotFoundError('Session not found', 'SESSION_NOT_FOUND');
    }

    if (session.status !== 'open') {
      throw new ConflictError('Session is no longer open', 'SESSION_FULL');
    }

    if (session.creatorId === userId) {
      throw new ConflictError('Creator cannot join their own session', 'CANNOT_JOIN_OWN_SESSION');
    }

    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: session.creatorId },
          { blockerId: session.creatorId, blockedId: userId }
        ]
      }
    });

    if (block) {
      throw new ForbiddenError('You cannot interact with this user', 'BLOCKED');
    }

    const participant = await this.sessionsRepository.addParticipant({
      session: { connect: { id: sessionId } },
      user: { connect: { id: userId } },
      role: 'joiner',
      stance
    });

    return { session, participant };
  }

  async markReady(userId: string, sessionId: string) {
    await this.sessionsRepository.setParticipantReady(sessionId, userId);

    const participants = await prisma.sessionParticipant.findMany({
      where: { sessionId }
    });

    if (participants.length === 2 && participants.every(p => p.isReady)) {
      await this.sessionsRepository.setStartedAt(sessionId);
      await this.createRoundsForSession(sessionId, participants);
      
      return { status: 'active' };
    }

    return { status: 'waiting_for_opponent' };
  }

  private async createRoundsForSession(sessionId: string, participants: any[]) {
    const session = await this.sessionsRepository.findById(sessionId);
    if (!session) return;

    const creatorId = participants.find(p => p.role === 'creator')?.userId;
    const joinerId = participants.find(p => p.role === 'joiner')?.userId;
    
    const roundsToCreate = [];
    let order = 1;
    
    roundsToCreate.push({ sessionId, roundType: 'opening', speakerId: creatorId, order: order++, turnDurationSeconds: 300, status: 'active' });
    roundsToCreate.push({ sessionId, roundType: 'opening', speakerId: joinerId, order: order++, turnDurationSeconds: 300, status: 'pending' });
    
    if (session.format !== 'quick') {
      roundsToCreate.push({ sessionId, roundType: 'rebuttal', speakerId: creatorId, order: order++, turnDurationSeconds: 180, status: 'pending' });
      roundsToCreate.push({ sessionId, roundType: 'rebuttal', speakerId: joinerId, order: order++, turnDurationSeconds: 180, status: 'pending' });
    }

    if (session.format === 'extended') {
      roundsToCreate.push({ sessionId, roundType: 'rebuttal', speakerId: creatorId, order: order++, turnDurationSeconds: 180, status: 'pending' });
      roundsToCreate.push({ sessionId, roundType: 'rebuttal', speakerId: joinerId, order: order++, turnDurationSeconds: 180, status: 'pending' });
    }

    roundsToCreate.push({ sessionId, roundType: 'closing', speakerId: creatorId, order: order++, turnDurationSeconds: 240, status: 'pending' });
    roundsToCreate.push({ sessionId, roundType: 'closing', speakerId: joinerId, order: order++, turnDurationSeconds: 240, status: 'pending' });

    await prisma.debateRound.createMany({
      data: roundsToCreate as any
    });
  }
}
