import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import prisma from '../config/database';
import { SessionStatus } from '@prisma/client';
import logger from '../config/logger';

const connection = {
  host: new URL(env.REDIS_URL).hostname,
  port: parseInt(new URL(env.REDIS_URL).port || '6379'),
};

export const expiryWorker = new Worker(
  'sessionExpiry',
  async (job: Job) => {
    const { sessionId } = job.data;
    
    try {
      const session = await prisma.session.findUnique({ where: { id: sessionId } });
      
      if (session && session.status === SessionStatus.open) {
        await prisma.session.update({
          where: { id: sessionId },
          data: { status: SessionStatus.expired }
        });
        logger.info(`Session ${sessionId} has expired.`);
      }
    } catch (error) {
      logger.error(`Expiry Worker Error for session ${sessionId}:`, error);
      throw error;
    }
  },
  { connection }
);
