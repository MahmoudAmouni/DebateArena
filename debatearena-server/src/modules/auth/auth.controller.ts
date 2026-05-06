import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/apiResponse';
import { UnauthorizedError } from '../../utils/errors';

export class AuthController {
  constructor(private authService: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await this.authService.register(req.body);
      
      this.setRefreshCookie(res, refreshToken);

      return sendSuccess(res, {
        user: { id: user.id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.authService.login(email, password);

      this.setRefreshCookie(res, refreshToken);

      return sendSuccess(res, {
        user: { id: user.id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) {
        throw new UnauthorizedError('Refresh token is required', 'TOKEN_REQUIRED');
      }

      const { accessToken, refreshToken } = await this.authService.refreshTokens(token);
      
      this.setRefreshCookie(res, refreshToken);

      return sendSuccess(res, {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (userId) {
        await this.authService.logout(userId);
      }
      res.clearCookie('refreshToken');
      return sendSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };
}
