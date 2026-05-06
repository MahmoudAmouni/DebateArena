import { Request, Response, NextFunction } from 'express';
import { DebatesService } from './debates.service';
import { DebatesRepository } from './debates.repository';
import { SessionsRepository } from '../sessions/sessions.repository';
import { sendSuccess } from '../../utils/apiResponse';
import { NotFoundError } from '../../utils/errors';

const debatesRepository = new DebatesRepository();
const sessionsRepository = new SessionsRepository();
const debatesService = new DebatesService(debatesRepository, sessionsRepository);

export const getTranscript = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId as string;
    const session = await sessionsRepository.findById(sessionId);
    if (!session) throw new NotFoundError('Session not found', 'SESSION_NOT_FOUND');

    const transcript = await debatesRepository.getTranscript(sessionId);
    return sendSuccess(res, transcript);
  } catch (error) {
    next(error);
  }
};

export const concedeDebate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId as string;
    const userId = req.user!.id as string;
    
    await debatesService.concede(userId, sessionId);
    
    return sendSuccess(res, { message: 'Conceded successfully' });
  } catch (error) {
    next(error);
  }
};

export const requestExtension = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId as string;
    const userId = req.user!.id as string;
    
    const result = await debatesService.requestExtension(userId, sessionId);
    
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const batchSubmit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId as string;
    const userId = req.user!.id as string;
    const { answers } = req.body;
    
    const result = await debatesService.batchSubmit(userId, sessionId, answers);
    
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
