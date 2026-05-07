import { Server, Socket } from 'socket.io';
import { DebatesService } from '../../modules/debates/debates.service';
import { DebatesRepository } from '../../modules/debates/debates.repository';
import { SessionsRepository } from '../../modules/sessions/sessions.repository';

const debatesRepository = new DebatesRepository();
const sessionsRepository = new SessionsRepository();
const debatesService = new DebatesService(debatesRepository, sessionsRepository);

export const registerDebateHandlers = (io: Server, socket: Socket) => {
  socket.on('debate:message', async (payload: { sessionId: string; content: string }, callback) => {
    try {
      if (!socket.user?.id) throw new Error('Unauthorized');
      const message = await debatesService.sendMessage(socket.user.id, payload.sessionId, payload.content);
      io.to(`session:${payload.sessionId}`).emit('debate:message_received', message);
      if (callback) callback({ success: true, data: message });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });

  socket.on('debate:typing', (payload: { sessionId: string }) => {
    if (!socket.user?.id) return;
    socket.to(`session:${payload.sessionId}`).emit('debate:typing', {
      userId: socket.user.id,
      username: socket.user.username
    });
  });

  socket.on('debate:turn_end', async (payload: { sessionId: string; roundId: string }, callback) => {
    try {
      if (!socket.user?.id) throw new Error('Unauthorized');
      const nextRound = await debatesService.handleTurnEnd(payload.sessionId, payload.roundId);
      if (nextRound) {
        io.to(`session:${payload.sessionId}`).emit('debate:round_advanced', nextRound);
      } else {
        io.to(`session:${payload.sessionId}`).emit('debate:debate_ended', { reason: 'completed' });
      }
      if (callback) callback({ success: true });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });

  socket.on('debate:concede', async (payload: { sessionId: string }, callback) => {
    try {
      if (!socket.user?.id) throw new Error('Unauthorized');
      await debatesService.concede(socket.user.id, payload.sessionId);
      io.to(`session:${payload.sessionId}`).emit('debate:debate_ended', { reason: 'conceded' });
      if (callback) callback({ success: true });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });

  socket.on('debate:extend', async (payload: { sessionId: string }, callback) => {
    try {
      if (!socket.user?.id) throw new Error('Unauthorized');
      const result = await debatesService.requestExtension(socket.user.id, payload.sessionId);
      io.to(`session:${payload.sessionId}`).emit('debate:extension_granted', result);
      if (callback) callback({ success: true, data: result });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });
};
