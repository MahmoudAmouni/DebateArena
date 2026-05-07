import { SessionsRepository, sessionsRepository } from './sessions.repository';
import { generateInviteCode } from '../../utils/inviteCode';
import { ForbiddenError, NotFoundError, ConflictError } from '../../utils/errors';
import prisma from '../../config/database';
import { SessionFormat, SessionVisibility } from '@prisma/client';
import { sessionExpiryQueue, debatePhaseQueue } from '../../queues';
import { callGroq } from '../../utils/ai';

export class SessionsService {
  constructor(private sessionsRepository: SessionsRepository) {}

  async screenTopic(title: string): Promise<{ flagged: boolean; reason: string | null }> {
    try {
      const prompt = `You are an automated moderation system for a debate platform. 
      Analyze this debate topic title and determine if it violates community guidelines (hate speech, illegal acts, explicit content, extreme violence).
      Respond ONLY with valid JSON in this exact format: {"flagged": boolean, "reason": "string or null"}.
      
      Topic: "${title}"`;

      const text = await callGroq(prompt, true);
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
    const { title, questions, creatorStance, visibility, categoryId } = data;

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

    const totalRounds = 5;

    const sessionData = {
      title,
      questions,
      creatorId: userId,
      categoryId,
      creatorStance,
      format: 'standard' as SessionFormat,
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
      
      await debatePhaseQueue.add('transitionToWriting', 
        { sessionId, nextPhase: 'writing' }, 
        { delay: 10000 } 
      );
      
      return { status: 'active' };
    }

    return { status: 'waiting_for_opponent' };
  }

  private async createRoundsForSession(sessionId: string, participants: any[]) {
    const session = await this.sessionsRepository.findById(sessionId);
    if (!session || !(session as any).questions) return;

    const questions = (session as any).questions as any[];
    
    const roundsToCreate = questions.map((question: string, index: number) => ({
      sessionId,
      roundNumber: index + 1,
      roundType: 'opening',
      status: 'pending',
      turnDurationSeconds: 300,
    }));

    await prisma.debateRound.createMany({
      data: roundsToCreate as any
    });
  }
}

export const sessionsService = new SessionsService(sessionsRepository);
