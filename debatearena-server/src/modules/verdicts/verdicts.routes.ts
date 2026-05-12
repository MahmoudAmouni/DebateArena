import { Router } from 'express';
import { VerdictsController } from './verdicts.controller';
import { VerdictsRepository } from './verdicts.repository';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
const repository = new VerdictsRepository();
const controller = new VerdictsController(repository);

router.get('/:sessionId', authenticate, controller.getVerdict);

export default router;
