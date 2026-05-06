import { Router } from 'express';
import { getTranscript, concedeDebate, requestExtension, batchSubmit } from './debates.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { batchSubmitSchema } from './debates.schema';

const router = Router();

router.get('/:sessionId/transcript', authenticate, authorize('participant'), getTranscript);
router.post('/:sessionId/concede', authenticate, authorize('participant'), concedeDebate);
router.post('/:sessionId/batch-submit', authenticate, authorize('participant'), validate(batchSubmitSchema), batchSubmit);
router.post('/:sessionId/extend', authenticate, authorize('participant'), requestExtension);

export default router;
