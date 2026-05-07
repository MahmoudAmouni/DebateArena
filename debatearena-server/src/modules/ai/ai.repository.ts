import prisma from '../../config/database';
import { Prisma, FactCheck, ResearchQuery, SessionParticipant } from '@prisma/client';

export class AiRepository {
  async findParticipant(sessionId: string, userId: string): Promise<SessionParticipant | null> {
    return prisma.sessionParticipant.findUnique({
      where: {
        sessionId_userId: { sessionId, userId }
      }
    });
  }

  async incrementFactChecksUsed(participantId: string): Promise<SessionParticipant> {
    return prisma.sessionParticipant.update({
      where: { id: participantId },
      data: {
        factChecksUsed: { increment: 1 }
      }
    });
  }

  async incrementResearchQueriesUsed(participantId: string): Promise<SessionParticipant> {
    return prisma.sessionParticipant.update({
      where: { id: participantId },
      data: {
        researchQueriesUsed: { increment: 1 }
      }
    });
  }

  async createFactCheck(data: Prisma.FactCheckUncheckedCreateInput): Promise<FactCheck> {
    return prisma.factCheck.create({
      data
    });
  }

  async updateFactCheck(id: string, data: Prisma.FactCheckUpdateInput): Promise<FactCheck> {
    return prisma.factCheck.update({
      where: { id },
      data
    });
  }

  async createResearchQuery(data: Prisma.ResearchQueryUncheckedCreateInput): Promise<ResearchQuery> {
    return prisma.researchQuery.create({
      data
    });
  }

  async updateResearchQuery(id: string, data: Prisma.ResearchQueryUpdateInput): Promise<ResearchQuery> {
    return prisma.researchQuery.update({
      where: { id },
      data
    });
  }
}
