import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { sendSuccess } from '../../utils/apiResponse';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export class AuthController {
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, ageConfirmed } = req.body;

      const [existingUser, existingUsername] = await Promise.all([
        this.usersRepository.findByEmail(email),
        this.usersRepository.findByUsername(username),
      ]);

      if (existingUser) {
        throw new BadRequestError('Email already in use', 'EMAIL_EXISTS');
      }

      if (existingUsername) {
        throw new BadRequestError('Username already taken', 'USERNAME_EXISTS');
      }

      const passwordHash = await this.authService.hashPassword(password);

      const user = await this.usersRepository.create({
        username,
        email,
        passwordHash,
        ageConfirmed,
      });

      const { accessToken, refreshToken } = this.authService.generateTokens(user);

      return sendSuccess(res, {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
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

      const user = await this.usersRepository.findByEmail(email);
      if (!user || !user.passwordHash) {
        throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
      }

      const isPasswordValid = await this.authService.comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
      }

      const { accessToken, refreshToken } = this.authService.generateTokens(user);

      return sendSuccess(res, {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };
}
