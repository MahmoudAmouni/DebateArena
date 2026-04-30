import { Router } from 'express';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
const usersRepository = new UsersRepository();
const usersController = new UsersController(usersRepository);

router.get('/me', authenticate, usersController.getMe);

export default router;
