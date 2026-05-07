import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import prisma from '../config/database';
import { calculateNewElo, MatchOutcome } from '../utils/elo';
import { badgeQueue } from '../queues';
import logger from '../config/logger';

const connection = {
  host: new URL(env.REDIS_URL).hostname,
  port: parseInt(new URL(env.REDIS_URL).port || '6379'),
};

export const eloWorker = new Worker(
  'eloJobs',
  async (job: Job) => {
    const { sessionId } = job.data;
    logger.info(`Processing ELO updates for session: ${sessionId}`);

    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          verdict: true,
          participants: {
            include: {
              user: true
            }
          }
        }
      });

      if (!session || !session.verdict) {
        throw new Error(`Session or verdict not found for ELO update: ${sessionId}`);
      }

      const winnerId = session.verdict.winnerParticipantId;
      const isTie = session.verdict.isTie;

      const participantA = session.participants[0];
      const participantB = session.participants[1];

      if (!participantA || !participantB) {
        throw new Error(`Incomplete participants for session: ${sessionId}`);
      }

      let outcomeA: MatchOutcome = 'tie';
      let outcomeB: MatchOutcome = 'tie';

      if (!isTie) {
        outcomeA = winnerId === participantA.id ? 'win' : 'loss';
        outcomeB = winnerId === participantB.id ? 'win' : 'loss';
      }

      const newGlobalEloA = calculateNewElo(
        participantA.user.globalElo,
        participantB.user.globalElo,
        outcomeA,
        participantA.user.totalWins + participantA.user.totalLosses + participantA.user.totalTies
      );

      const newGlobalEloB = calculateNewElo(
        participantB.user.globalElo,
        participantA.user.globalElo,
        outcomeB,
        participantB.user.totalWins + participantB.user.totalLosses + participantB.user.totalTies
      );

      let topicRatingA = await prisma.userTopicRating.findUnique({
        where: {
          userId_categoryId: {
            userId: participantA.userId,
            categoryId: session.categoryId
          }
        }
      });

      if (!topicRatingA) {
        topicRatingA = await prisma.userTopicRating.create({
          data: {
            userId: participantA.userId,
            categoryId: session.categoryId,
            elo: 1000
          }
        });
      }

      let topicRatingB = await prisma.userTopicRating.findUnique({
        where: {
          userId_categoryId: {
            userId: participantB.userId,
            categoryId: session.categoryId
          }
        }
      });

      if (!topicRatingB) {
        topicRatingB = await prisma.userTopicRating.create({
          data: {
            userId: participantB.userId,
            categoryId: session.categoryId,
            elo: 1000
          }
        });
      }

      const newTopicEloA = calculateNewElo(
        topicRatingA.elo,
        topicRatingB.elo,
        outcomeA,
        topicRatingA.debatesCount
      );

      const newTopicEloB = calculateNewElo(
        topicRatingB.elo,
        topicRatingA.elo,
        outcomeB,
        topicRatingB.debatesCount
      );

      await prisma.$transaction([
        prisma.user.update({
          where: { id: participantA.userId },
          data: {
            globalElo: newGlobalEloA,
            totalWins: { increment: outcomeA === 'win' ? 1 : 0 },
            totalLosses: { increment: outcomeA === 'loss' ? 1 : 0 },
            totalTies: { increment: outcomeA === 'tie' ? 1 : 0 },
          }
        }),
        prisma.userTopicRating.update({
          where: { id: topicRatingA.id },
          data: {
            elo: newTopicEloA,
            wins: { increment: outcomeA === 'win' ? 1 : 0 },
            losses: { increment: outcomeA === 'loss' ? 1 : 0 },
            ties: { increment: outcomeA === 'tie' ? 1 : 0 },
            debatesCount: { increment: 1 }
          }
        }),
        prisma.sessionParticipant.update({
          where: { id: participantA.id },
          data: {
            eloBefore: participantA.user.globalElo,
            eloAfter: newGlobalEloA,
            eloChange: newGlobalEloA - participantA.user.globalElo
          }
        }),

        prisma.user.update({
          where: { id: participantB.userId },
          data: {
            globalElo: newGlobalEloB,
            totalWins: { increment: outcomeB === 'win' ? 1 : 0 },
            totalLosses: { increment: outcomeB === 'loss' ? 1 : 0 },
            totalTies: { increment: outcomeB === 'tie' ? 1 : 0 },
          }
        }),
        prisma.userTopicRating.update({
          where: { id: topicRatingB.id },
          data: {
            elo: newTopicEloB,
            wins: { increment: outcomeB === 'win' ? 1 : 0 },
            losses: { increment: outcomeB === 'loss' ? 1 : 0 },
            ties: { increment: outcomeB === 'tie' ? 1 : 0 },
            debatesCount: { increment: 1 }
          }
        }),
        prisma.sessionParticipant.update({
          where: { id: participantB.id },
          data: {
            eloBefore: participantB.user.globalElo,
            eloAfter: newGlobalEloB,
            eloChange: newGlobalEloB - participantB.user.globalElo
          }
        })
      ]);

      logger.info(`ELO updates completed for session ${sessionId}. Enqueueing badge checks.`);

      await badgeQueue.add(`badges-${sessionId}`, {
        sessionId,
        userIds: [participantA.userId, participantB.userId]
      });

    } catch (error) {
      logger.error(`ELO Worker Error for session ${sessionId}:`, error);
      throw error;
    }
  },
  { connection }
);

eloWorker.on('failed', (job, err) => {
  logger.error(`ELO Job ${job?.id} failed:`, err);
});
