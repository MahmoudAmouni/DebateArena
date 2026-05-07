import { Server, Socket } from 'socket.io';
import prisma from '../../config/database';
import { SessionsRepository } from '../../modules/sessions/sessions.repository';

const sessionsRepository = new SessionsRepository();

export const registerObserverHandlers = (io: Server, socket: Socket) => {
  socket.on('observer:join', async (payload: { sessionId: string }, callback) => {
    try {
      const userId = socket.user?.id || null;
      
      const observer = await prisma.sessionObserver.create({
        data: {
          sessionId: payload.sessionId,
          userId
        }
      });

      await sessionsRepository.incrementObserverCount(payload.sessionId);
      
      const session = await sessionsRepository.findById(payload.sessionId);
      io.to(`session:${payload.sessionId}`).emit('observer:count_updated', { 
        count: session?.observerCount || 0 
      });

      socket.join(`session:${payload.sessionId}`);
      
      if (callback) callback({ success: true, observerId: observer.id });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });

  socket.on('observer:leave', async (payload: { sessionId: string; observerId: string }, callback) => {
    try {
      await prisma.sessionObserver.update({
        where: { id: payload.observerId },
        data: { leftAt: new Date() }
      });

      await sessionsRepository.decrementObserverCount(payload.sessionId);
      
      const session = await sessionsRepository.findById(payload.sessionId);
      io.to(`session:${payload.sessionId}`).emit('observer:count_updated', { 
        count: session?.observerCount || 0 
      });

      socket.leave(`session:${payload.sessionId}`);
      
      if (callback) callback({ success: true });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });

  socket.on('observer:vote', async (payload: { sessionId: string; observerId: string; votedForParticipantId: string }, callback) => {
    try {
      const existingVote = await prisma.observerVote.findUnique({
        where: {
          sessionId_observerId: { 
            sessionId: payload.sessionId, 
            observerId: payload.observerId 
          }
        }
      });

      if (existingVote) throw new Error('Already voted');

      const vote = await prisma.observerVote.create({
        data: {
          sessionId: payload.sessionId,
          observerId: payload.observerId,
          votedForParticipantId: payload.votedForParticipantId
        }
      });

      socket.emit('observer:vote_confirmed', vote);
      if (callback) callback({ success: true, data: vote });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });
};
