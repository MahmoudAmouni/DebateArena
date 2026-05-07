import { Server, Socket } from 'socket.io';
import { socketAuth } from './middleware/socketAuth';
import { registerDebateHandlers } from './handlers/debateHandler';
import { registerAiHandlers } from './handlers/aiHandler';
import { registerObserverHandlers } from './handlers/observerHandler';

export const setupSocketHandlers = (io: Server) => {
  io.use(socketAuth);

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.user?.username || 'Anonymous'} (${socket.id})`);

    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    registerDebateHandlers(io, socket);
    registerAiHandlers(io, socket);
    registerObserverHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
