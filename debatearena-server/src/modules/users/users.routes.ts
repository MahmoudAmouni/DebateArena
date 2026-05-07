import { Router } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.get('/leaderboard', usersController.getLeaderboard);
router.get('/leaderboard/:categorySlug', usersController.getCategoryLeaderboard);
router.get('/me', authenticate, usersController.getMe);
router.get('/me/debates', authenticate, usersController.getDebateHistory);
router.get('/me/badges', authenticate, usersController.getBadges);
router.get('/me/notifications', authenticate, usersController.getNotifications);
router.patch('/me/notifications/:id/read', authenticate, usersController.markNotificationRead);
router.post('/:id/block', authenticate, usersController.blockUser);
router.delete('/:id/block', authenticate, usersController.unblockUser);
router.get('/:username', usersController.getPublicProfile);

export default router;
