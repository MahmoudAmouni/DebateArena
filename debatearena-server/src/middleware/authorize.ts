import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export type Role = 'session_creator' | 'participant' | 'admin';

export const authorize = (role: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (role === 'admin') {
        const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!(fullUser as any).isAdmin && !(fullUser as any).role) {
           throw new ForbiddenError('Admin access required', 'FORBIDDEN');
        }
      }

      if (role === 'session_creator' || role === 'participant') {
        const sessionId = (req.params.sessionId || req.params.id) as string;
        if (!sessionId) {
          throw new ForbiddenError('Session ID is required for this action', 'FORBIDDEN');
        }

        if (role === 'session_creator') {
          const session = await prisma.session.findUnique({
            where: { id: sessionId }
          });
          if (!session || session.creatorId !== user.id) {
            throw new ForbiddenError('Only the session creator can perform this action', 'FORBIDDEN');
          }
        }

        if (role === 'participant') {
          const participant = await prisma.sessionParticipant.findFirst({
            where: {
              sessionId: sessionId,
              userId: user.id
            }
          });
          if (!participant) {
            throw new ForbiddenError('Only active participants can perform this action', 'FORBIDDEN');
          }
        }
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
