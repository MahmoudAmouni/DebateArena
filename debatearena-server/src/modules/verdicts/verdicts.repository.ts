import prisma from '../../config/database';
import { Prisma, Verdict } from '@prisma/client';

export class VerdictsRepository {
  async findFullSession(sessionId: string) {
    return prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true } }
          }
        },
        category: true
      }
    });
  }

  async findFactChecks(sessionId: string) {
    return prisma.factCheck.findMany({
      where: { sessionId, completedAt: { not: null } },
      orderBy: { requestedAt: 'asc' }
    });
  }

  async findResearchQueries(sessionId: string) {
    return prisma.researchQuery.findMany({
      where: { sessionId, completedAt: { not: null } },
      orderBy: { requestedAt: 'asc' }
    });
  }

  async createVerdict(data: Prisma.VerdictUncheckedCreateInput): Promise<Verdict> {
    return prisma.verdict.create({
      data
    });
  }

  async createVerdictScores(data: Prisma.VerdictScoreUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
    return prisma.verdictScore.createMany({
      data
    });
  }

  async findBySessionId(sessionId: string) {
    return prisma.verdict.findUnique({
      where: { sessionId },
      include: {
        scores: {
          include: {
            participant: {
              include: {
                user: { select: { username: true, avatarUrl: true } }
              }
            }
          }
        },
        winner: {
          include: {
            user: { select: { username: true, avatarUrl: true } }
          }
        }
      }
    });
  }
}
