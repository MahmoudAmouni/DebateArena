import prisma from '../../config/database';
import { ChallengeStatus } from '@prisma/client';

export class ChallengesRepository {
  async create(data: {
    challengerId: string;
    challengedId: string;
    topic: string;
    challengerStance: string;
    categoryId: string;
    message?: string;
    expiresAt: Date;
  }) {
    return prisma.challenge.create({
      data,
      include: {
        challenger: {
          select: { username: true, avatarUrl: true }
        },
        challenged: {
          select: { username: true, avatarUrl: true }
        },
        category: true
      }
    });
  }

  async findById(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
      include: {
        challenger: true,
        challenged: true,
        category: true
      }
    });
  }

  async findReceived(userId: string) {
    return prisma.challenge.findMany({
      where: {
        challengedId: userId,
        status: ChallengeStatus.pending,
        expiresAt: { gt: new Date() }
      },
      include: {
        challenger: {
          select: { username: true, avatarUrl: true, globalElo: true }
        },
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findSent(userId: string) {
    return prisma.challenge.findMany({
      where: { challengerId: userId },
      include: {
        challenged: {
          select: { username: true, avatarUrl: true, globalElo: true }
        },
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: ChallengeStatus, sessionId?: string) {
    return prisma.challenge.update({
      where: { id },
      data: {
        status,
        sessionId,
        respondedAt: new Date()
      }
    });
  }
}

export const challengesRepository = new ChallengesRepository();
