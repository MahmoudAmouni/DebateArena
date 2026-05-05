import { Router } from 'express';
import { getTranscript, concedeDebate, requestExtension } from './debates.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.get('/:sessionId/transcript', authenticate, authorize('participant'), getTranscript);
router.post('/:sessionId/concede', authenticate, authorize('participant'), concedeDebate);
router.post('/:sessionId/extend', authenticate, authorize('participant'), requestExtension);

export default router;
