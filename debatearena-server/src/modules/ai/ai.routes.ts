import { Router } from 'express';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiRepository } from './ai.repository';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();

const aiRepository = new AiRepository();
const aiService = new AiService(aiRepository);
const aiController = new AiController(aiService);

// POST /api/ai/:sessionId/fact-check
router.post(
  '/:sessionId/fact-check',
  authenticate,
  authorize('participant'),
  aiController.factCheck
);

// POST /api/ai/:sessionId/research
router.post(
  '/:sessionId/research',
  authenticate,
  authorize('participant'),
  aiController.research
);

export default router;
