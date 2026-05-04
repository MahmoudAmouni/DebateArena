import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { sendSuccess } from '../../utils/apiResponse';
import { UnauthorizedError } from '../../utils/errors';

export class UsersController {
  constructor(private usersService: UsersService) {}

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('Authentication required');
      }

      const profile = await this.usersService.getOwnProfile(userId);

      return sendSuccess(res, { user: profile });
    } catch (error) {
      next(error);
    }
  };
}
