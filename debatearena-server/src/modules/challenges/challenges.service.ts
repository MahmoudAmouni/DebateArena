import { challengesRepository } from './challenges.repository';
import { sessionsService } from '../sessions/sessions.service';
import prisma from '../../config/database';
import { NotFoundError, ForbiddenError, ConflictError } from '../../utils/errors';
import { ChallengeStatus } from '@prisma/client';

export class ChallengesService {
  async sendChallenge(challengerId: string, data: any) {
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: challengerId, blockedId: data.challengedId },
          { blockerId: data.challengedId, blockedId: challengerId }
        ]
      }
    });

    if (isBlocked) {
      throw new ForbiddenError('Cannot challenge a blocked user', 'USER_BLOCKED');
    }

    const challengedUser = await prisma.user.findUnique({ where: { id: data.challengedId } });
    if (!challengedUser) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return challengesRepository.create({
      challengerId,
      ...data,
      expiresAt
    });
  }

  async getReceivedChallenges(userId: string) {
    return challengesRepository.findReceived(userId);
  }

  async getSentChallenges(userId: string) {
    return challengesRepository.findSent(userId);
  }

  async acceptChallenge(userId: string, challengeId: string, stance: string) {
    const challenge = await challengesRepository.findById(challengeId);

    if (!challenge) {
      throw new NotFoundError('Challenge not found', 'CHALLENGE_NOT_FOUND');
    }

    if (challenge.challengedId !== userId) {
      throw new ForbiddenError('Not authorized to accept this challenge', 'NOT_AUTHORIZED');
    }

    if (challenge.status !== ChallengeStatus.pending) {
      throw new ConflictError(`Challenge is already ${challenge.status}`, 'CHALLENGE_INACTIVE');
    }

    if (challenge.expiresAt < new Date()) {
      await challengesRepository.updateStatus(challengeId, ChallengeStatus.expired);
      throw new ConflictError('Challenge has expired', 'CHALLENGE_EXPIRED');
    }

    const session = await sessionsService.createSession(challenge.challengerId, {
      title: challenge.topic,
      creatorStance: challenge.challengerStance,
      categoryId: challenge.categoryId,
      format: 'standard',
      visibility: 'public',
      isRanked: true
    });

    await sessionsService.joinSession(userId, session.id, stance);

    await challengesRepository.updateStatus(challengeId, ChallengeStatus.accepted, session.id);

    return session;
  }

  async declineChallenge(userId: string, challengeId: string) {
    const challenge = await challengesRepository.findById(challengeId);

    if (!challenge) {
      throw new NotFoundError('Challenge not found', 'CHALLENGE_NOT_FOUND');
    }

    if (challenge.challengedId !== userId) {
      throw new ForbiddenError('Not authorized to decline this challenge', 'NOT_AUTHORIZED');
    }

    return challengesRepository.updateStatus(challengeId, ChallengeStatus.declined);
  }
}

export const challengesService = new ChallengesService();
