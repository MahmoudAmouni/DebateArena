import prisma from '../../config/database';
import { Prisma, Session, SessionStatus, EndReason } from '@prisma/client';

export class SessionsRepository {
  async createSession(data: Prisma.SessionCreateInput): Promise<Session> {
    return prisma.session.create({ data });
  }

  async findById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: { id: true, username: true, avatarUrl: true, globalElo: true }
        },
      }
    });
  }

  async findOpenSessions(
    filters: { categoryId?: string; search?: string },
    limit: number = 20,
    cursor?: string
  ) {
    const where: Prisma.SessionWhereInput = {
      status: 'open',
      visibility: 'public',
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.title = { contains: filters.search };
    }

    const query: Prisma.SessionFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        creator: {
          select: { id: true, username: true, globalElo: true, avatarUrl: true }
        }
      }
    };

    if (cursor) {
      query.cursor = { id: cursor };
    }

    return prisma.session.findMany(query);
  }

  async findByCreator(creatorId: string): Promise<Session[]> {
    return prisma.session.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: SessionStatus): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: { status }
    });
  }

  async setStartedAt(id: string): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        status: 'active',
        startedAt: new Date()
      }
    });
  }

  async setEndedAt(id: string, reason: EndReason): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        status: 'completed',
        endedAt: new Date(),
        endReason: reason
      }
    });
  }

  async incrementObserverCount(id: string): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: { observerCount: { increment: 1 } }
    });
  }

  async decrementObserverCount(id: string): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: { observerCount: { decrement: 1 } }
    });
  }

  
  async addParticipant(data: Prisma.SessionParticipantCreateInput) {
    return prisma.sessionParticipant.create({ data });
  }

  async setParticipantReady(sessionId: string, userId: string) {
    return prisma.sessionParticipant.update({
      where: {
        sessionId_userId: { sessionId, userId }
      },
      data: { isReady: true }
    });
  }
}

export const sessionsRepository = new SessionsRepository();
