import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import prisma from '../config/database';
import logger from '../config/logger';

const connection = {
  host: new URL(env.REDIS_URL).hostname,
  port: parseInt(new URL(env.REDIS_URL).port || '6379'),
};

export const badgeWorker = new Worker(
  'badgeJobs',
  async (job: Job) => {
    const { userIds } = job.data;
    
    for (const userId of userIds) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { badges: true }
        });

        if (!user) continue;

        const earnedBadges = user.badges.map(ub => ub.badgeId);

        if (!earnedBadges.includes('first_win') && user.totalWins >= 1) {
          const badge = await prisma.badge.findUnique({ where: { slug: 'first_win' } });
          if (badge) {
            await prisma.userBadge.create({
              data: { userId, badgeId: badge.id }
            });
          }
        }
      } catch (error) {
        logger.error(`Badge Worker Error for user ${userId}:`, error);
      }
    }
  },
  { connection }
);
