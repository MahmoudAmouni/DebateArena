import prisma from '../../config/database';
import { ConflictError } from '../../utils/errors';

export class ObserversService {
  async castVote(observerId: string, sessionId: string, votedForParticipantId: string) {
    const existingVote = await prisma.observerVote.findUnique({
      where: {
        sessionId_observerId: {
          sessionId,
          observerId
        }
      }
    });

    if (existingVote) {
      throw new ConflictError('You have already voted in this session', 'ALREADY_VOTED');
    }

    return prisma.observerVote.create({
      data: {
        sessionId,
        observerId,
        votedForParticipantId
      }
    });
  }

  async getVoteTally(sessionId: string) {
    const votes = await prisma.observerVote.groupBy({
      by: ['votedForParticipantId'],
      where: { sessionId },
      _count: true
    });

    return votes.map(v => ({
      participantId: v.votedForParticipantId,
      count: v._count
    }));
  }
}

export const observersService = new ObserversService();
