import { Router } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.get('/me', authenticate, usersController.getMe);

export default router;
