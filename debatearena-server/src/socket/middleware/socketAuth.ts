import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      const err = new Error('Authentication required');
      (err as any).data = { code: 'UNAUTHORIZED' };
      return next(err);
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;

    socket.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (error) {
    const err = new Error('Invalid or expired token');
    (err as any).data = { code: 'INVALID_TOKEN' };
    return next(err);
  }
};
