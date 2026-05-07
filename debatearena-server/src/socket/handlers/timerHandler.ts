import { Server } from 'socket.io';
import { DebatesService } from '../../modules/debates/debates.service';
import { DebatesRepository } from '../../modules/debates/debates.repository';
import { SessionsRepository } from '../../modules/sessions/sessions.repository';

const debatesRepository = new DebatesRepository();
const sessionsRepository = new SessionsRepository();
const debatesService = new DebatesService(debatesRepository, sessionsRepository);

const activeTimers = new Map<string, NodeJS.Timeout>();

export const startTimer = (io: Server, sessionId: string, roundId: string, durationSeconds: number) => {
  stopTimer(roundId);

  let remaining = durationSeconds;

  const interval = setInterval(async () => {
    remaining -= 5;

    if (remaining <= 0) {
      stopTimer(roundId);
      io.to(`session:${sessionId}`).emit('debate:timer_sync', { remaining: 0 });
      
      const nextRound = await debatesService.handleTimeout(sessionId, roundId);
      io.to(`session:${sessionId}`).emit('debate:turn_timeout', { roundId });
      
      if (nextRound) {
        io.to(`session:${sessionId}`).emit('debate:round_advanced', nextRound);
      } else {
        io.to(`session:${sessionId}`).emit('debate:debate_ended', { reason: 'timeout' });
      }
    } else {
      io.to(`session:${sessionId}`).emit('debate:timer_sync', { remaining });
    }
  }, 5000);

  activeTimers.set(roundId, interval);
};

export const stopTimer = (roundId: string) => {
  const timer = activeTimers.get(roundId);
  if (timer) {
    clearInterval(timer);
    activeTimers.delete(roundId);
  }
};
