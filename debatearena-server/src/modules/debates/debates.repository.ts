import prisma from '../../config/database';
import { Prisma, DebateRound, Message, SessionParticipant, Session } from '@prisma/client';

export class DebatesRepository {
  async findRound(roundId: string): Promise<DebateRound | null> {
    return prisma.debateRound.findUnique({
      where: { id: roundId }
    });
  }

  async findActiveRound(sessionId: string): Promise<DebateRound | null> {
    return prisma.debateRound.findFirst({
      where: {
        sessionId,
        status: 'active'
      }
    });
  }

  async findParticipant(sessionId: string, userId: string): Promise<SessionParticipant | null> {
    return prisma.sessionParticipant.findUnique({
      where: {
        sessionId_userId: { sessionId, userId }
      }
    });
  }

  async findSession(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id }
    });
  }

  async getTranscript(sessionId: string) {
    return prisma.message.findMany({
      where: { sessionId },
      orderBy: { sentAt: 'asc' },
      include: {
        round: true,
        participant: {
          include: {
            user: { select: { username: true, avatarUrl: true } }
          }
        }
      }
    });
  }

  async createMessage(data: Prisma.MessageUncheckedCreateInput): Promise<Message> {
    return prisma.message.create({
      data,
      include: {
        participant: {
          include: {
            user: { select: { username: true, avatarUrl: true } }
          }
        }
      }
    });
  }

  async markRoundCompleted(roundId: string, timedOut: boolean = false): Promise<DebateRound> {
    return prisma.debateRound.update({
      where: { id: roundId },
      data: {
        status: 'completed',
        endedAt: new Date(),
        timedOut
      }
    });
  }

  async activateNextRound(sessionId: string, currentRoundNumber: number): Promise<DebateRound | null> {
    const nextRound = await prisma.debateRound.findFirst({
      where: {
        sessionId,
        roundNumber: { gt: currentRoundNumber },
        status: 'pending'
      },
      orderBy: { roundNumber: 'asc' }
    });

    if (!nextRound) return null;

    return prisma.debateRound.update({
      where: { id: nextRound.id },
      data: {
        status: 'active',
        startedAt: new Date()
      }
    });
  }

  async getPendingRounds(sessionId: string): Promise<DebateRound[]> {
    return prisma.debateRound.findMany({
      where: {
        sessionId,
        status: 'pending'
      },
      orderBy: { roundNumber: 'asc' }
    });
  }
}
