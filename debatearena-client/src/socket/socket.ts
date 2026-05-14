import { io, Socket } from 'socket.io-client';
import { env } from '@/lib/env';

export const socket: Socket = io(env.VITE_SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

/**
 * Manually connect the socket with a specific auth token.
 * This pattern avoids closure issues and ensures the token is fresh.
 */
export const connectSocket = (token: string) => {
  if (socket.connected) return;
  
  socket.auth = { token };
  socket.connect();
};

/**
 * Cleanly disconnect the socket.
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Logging for development
if (import.meta.env.DEV) {
  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 Socket connection error:', error);
  });
}
