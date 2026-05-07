import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import prisma from '../config/database';
import { io } from '../server';
import logger from '../config/logger';

const connection = {
  host: new URL(env.REDIS_URL).hostname,
  port: parseInt(new URL(env.REDIS_URL).port || '6379'),
};

export const debatePhaseWorker = new Worker('debatePhase', async (job: Job) => {
  const { sessionId, nextPhase } = job.data;

  try {
    logger.info(`[DebatePhaseWorker] Transitioning session ${sessionId} to ${nextPhase}`);

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return;

    if (nextPhase === 'writing' && (session.status as string) === 'active') {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: 'writing' as any }
      });

      io.to(`session:${sessionId}`).emit('debate:phase_changed', { phase: 'writing', duration: 300 });
      logger.info(`[DebatePhaseWorker] Session ${sessionId} is now in WRITING phase.`);
    }

  } catch (error) {
    logger.error(`[DebatePhaseWorker] Error transitioning session ${sessionId}:`, error);
  }
}, { connection });
