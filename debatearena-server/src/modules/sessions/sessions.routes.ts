import { Router } from 'express';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { createSessionSchema, joinSessionSchema } from './sessions.schema';

const router = Router();

const sessionsRepository = new SessionsRepository();
const sessionsService = new SessionsService(sessionsRepository);
const sessionsController = new SessionsController(sessionsService, sessionsRepository);

router.get('/', sessionsController.getFeed);
router.post('/', authenticate, validate(createSessionSchema), sessionsController.create);
router.get('/:id', sessionsController.getById);

router.post(
  '/:id/join',
  authenticate,
  validate(joinSessionSchema),
  sessionsController.join
);

router.post(
  '/:id/ready',
  authenticate,
  authorize('participant'),
  sessionsController.ready
);

export default router;
