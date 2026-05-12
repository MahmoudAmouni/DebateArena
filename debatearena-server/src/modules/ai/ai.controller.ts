import { Request, Response, NextFunction } from 'express';
import { AiService } from './ai.service';
import { sendSuccess } from '../../utils/apiResponse';

export class AiController {
  constructor(private aiService: AiService) {}

  factCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.sessionId as string;
      const { claimText, messageId } = req.body;
      const userId = req.user!.id as string;

      const result = await this.aiService.factCheck(sessionId, userId, claimText, messageId);

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  research = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.sessionId as string;
      const { queryText } = req.body;
      const userId = req.user!.id as string;

      const result = await this.aiService.research(sessionId, userId, queryText);

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
