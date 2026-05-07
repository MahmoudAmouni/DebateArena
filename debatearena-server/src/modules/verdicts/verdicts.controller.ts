import { Request, Response, NextFunction } from 'express';
import { VerdictsRepository } from './verdicts.repository';
import { sendSuccess } from '../../utils/apiResponse';
import { NotFoundError, ForbiddenError } from '../../utils/errors';
import prisma from '../../config/database';

export class VerdictsController {
  constructor(private verdictsRepository: VerdictsRepository) {}

  getVerdict = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.sessionId as string;
      const userId = req.user!.id as string;

      const participant = await prisma.sessionParticipant.findUnique({
        where: { sessionId_userId: { sessionId, userId } }
      });

      const observer = await prisma.sessionObserver.findFirst({
        where: { sessionId, userId }
      });

      if (!participant && !observer) {
        throw new ForbiddenError('You do not have access to this verdict', 'ACCESS_DENIED');
      }

      const verdict = await this.verdictsRepository.findBySessionId(sessionId);
      if (!verdict) {
        throw new NotFoundError('Verdict not found or still generating', 'VERDICT_NOT_FOUND');
      }

      return sendSuccess(res, verdict);
    } catch (error) {
      next(error);
    }
  };
}
