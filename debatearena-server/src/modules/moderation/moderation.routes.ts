import { Router } from 'express';
import { 
  submitReport, 
  reviewReport, 
  getReports, 
  warnUser, 
  suspendUser, 
  banUser 
} from './moderation.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);

router.post('/report', submitReport);

router.get('/reports', authorize('admin'), getReports);
router.patch('/reports/:id', authorize('admin'), reviewReport);
router.post('/users/:id/warn', authorize('admin'), warnUser);
router.post('/users/:id/suspend', authorize('admin'), suspendUser);
router.post('/users/:id/ban', authorize('admin'), banUser);

export default router;
