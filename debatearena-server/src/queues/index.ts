import { Queue } from 'bullmq';
import { env } from '../config/env';

const connection = {
  host: new URL(env.REDIS_URL).hostname,
  port: parseInt(new URL(env.REDIS_URL).port || '6379'),
};

export const verdictQueue = new Queue('verdictJobs', { connection });
export const eloQueue = new Queue('eloJobs', { connection });
export const badgeQueue = new Queue('badgeJobs', { connection });
export const sessionExpiryQueue = new Queue('sessionExpiry', { connection });
export const debatePhaseQueue = new Queue('debatePhase', { connection });
