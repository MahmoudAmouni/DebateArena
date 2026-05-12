import { Router } from 'express';
import { 
  sendChallenge, 
  getReceivedChallenges, 
  getSentChallenges, 
  acceptChallenge, 
  declineChallenge 
} from './challenges.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { createChallengeSchema, respondChallengeSchema } from './challenges.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createChallengeSchema), sendChallenge);
router.get('/received', getReceivedChallenges);
router.get('/sent', getSentChallenges);
router.post('/:id/accept', validate(respondChallengeSchema), acceptChallenge);
router.post('/:id/decline', declineChallenge);

export default router;
