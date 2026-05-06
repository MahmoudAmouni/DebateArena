import { Request, Response, NextFunction } from 'express';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { sendSuccess } from '../../utils/apiResponse';
import { NotFoundError, UnauthorizedError, ForbiddenError } from '../../utils/errors';

export class SessionsController {
  constructor(
    private sessionsService: SessionsService,
    private sessionsRepository: SessionsRepository
  ) {}

  getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId, search, cursor, limit } = req.query;
      
      const filters = {
        categoryId: categoryId as string,
        search: search as string,
      };

      const limitNumber = limit ? parseInt(limit as string, 10) : 20;

      const sessions = await this.sessionsRepository.findOpenSessions(
        filters,
        limitNumber,
        cursor as string
      );

      let nextCursor = null;
      if (sessions.length > limitNumber) {
        const nextItem = sessions.pop(); // Remove the extra item
        nextCursor = nextItem?.id;
      }

      return sendSuccess(res, { sessions, nextCursor });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const session = await this.sessionsService.createSession(userId, req.body);
      
      return sendSuccess(res, { session }, 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const session = await this.sessionsRepository.findById(id);

      if (!session) {
        throw new NotFoundError('Session not found', 'SESSION_NOT_FOUND');
      }

      return sendSuccess(res, { session });
    } catch (error) {
      next(error);
    }
  };

  join = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      
      const id = req.params.id as string;
      const { stance } = req.body;

      const result = await this.sessionsService.joinSession(userId, id, stance);

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  ready = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      
      const id = req.params.id as string;

      const result = await this.sessionsService.markReady(userId, id);

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
