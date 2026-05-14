import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { sendSuccess } from '../../utils/apiResponse';
import { UnauthorizedError } from '../../utils/errors';

export class UsersController {
  constructor(private usersService: UsersService) {}

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      const profile = await this.usersService.getOwnProfile(userId);
      return sendSuccess(res, profile);
    } catch (error) { next(error); }
  };

  getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.usersService.getPublicProfile(req.params.username as string);
      return sendSuccess(res, profile);
    } catch (error) { next(error); }
  };

  getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.usersService.getLeaderboard(req.query.cursor as string);
      return sendSuccess(res, result.data, 200, { nextCursor: result.nextCursor });
    } catch (error) { next(error); }
  };

  getCategoryLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.usersService.getCategoryLeaderboard(
        req.params.categorySlug as string,
        req.query.cursor as string
      );
      return sendSuccess(res, result.data, 200, { nextCursor: result.nextCursor });
    } catch (error) { next(error); }
  };

  getDebateHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      const result = await this.usersService.getDebateHistory(userId, req.query.cursor as string);
      return sendSuccess(res, result.data, 200, { nextCursor: result.nextCursor });
    } catch (error) { next(error); }
  };

  getBadges = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      const badges = await this.usersService.getBadges(userId);
      return sendSuccess(res, badges);
    } catch (error) { next(error); }
  };

  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      const notifications = await this.usersService.getNotifications(userId);
      return sendSuccess(res, notifications);
    } catch (error) { next(error); }
  };

  markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      await this.usersService.markNotificationRead(req.params.id as string, userId);
      return sendSuccess(res, { success: true });
    } catch (error) { next(error); }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      await this.usersService.blockUser(userId, req.params.id as string);
      return sendSuccess(res, { blocked: true });
    } catch (error) { next(error); }
  };

  unblockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      await this.usersService.unblockUser(userId, req.params.id as string);
      return sendSuccess(res, { unblocked: true });
    } catch (error) { next(error); }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Authentication required');
      const updatedUser = await this.usersService.updateProfile(userId, req.body);
      return sendSuccess(res, updatedUser);
    } catch (error) { next(error); }
  };
}
