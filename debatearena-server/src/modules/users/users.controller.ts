import { Request, Response, NextFunction } from 'express';
import { UsersRepository } from './users.repository';
import { sendSuccess } from '../../utils/apiResponse';
import { NotFoundError, UnauthorizedError } from '../../utils/errors';

export class UsersController {
  constructor(private usersRepository: UsersRepository) {}

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('Authentication required');
      }

      const user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found', 'USER_NOT_FOUND');
      }

      const { passwordHash, ...userWithoutPassword } = user;

      return sendSuccess(res, { user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  };
}
