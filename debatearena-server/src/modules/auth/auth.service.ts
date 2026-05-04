import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UsersRepository } from '../users/users.repository';
import { User } from '@prisma/client';
import redis from '../../config/redis';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '../../utils/errors';

export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async register(data: any) {
    const { username, email, password, ageConfirmed } = data;
    
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

    const passwordHash = await this.hashPassword(password);

    const user = await this.usersRepository.create({
      username,
      email,
      passwordHash,
      ageConfirmed,
    });
    
    const { accessToken, refreshToken } = await this.generateAndStoreTokens(user);
    return { user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (user.isBanned) {
      if (!user.banExpiresAt) {
        throw new ForbiddenError('Account is permanently banned', 'BANNED');
      } else if (new Date() < user.banExpiresAt) {
        throw new ForbiddenError(`Account is banned until ${user.banExpiresAt.toISOString()}`, 'SUSPENDED');
      }
    }

    const { accessToken, refreshToken } = await this.generateAndStoreTokens(user);
    return { user, accessToken, refreshToken };
  }

  async refreshTokens(rawRefreshToken: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(rawRefreshToken, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_TOKEN');
    }
    
    const userId = decoded.id;
    const storedHash = await redis.get(`refresh:${userId}`);
    if (!storedHash) {
      throw new UnauthorizedError('Invalid refresh token', 'INVALID_TOKEN');
    }

    const isValid = await this.comparePassword(rawRefreshToken, storedHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid refresh token', 'INVALID_TOKEN');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
    }

    if (user.isBanned) {
      throw new ForbiddenError('Account is banned', 'BANNED');
    }

    // Rotate tokens
    await redis.del(`refresh:${userId}`);
    const { accessToken, refreshToken } = await this.generateAndStoreTokens(user);

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await redis.del(`refresh:${userId}`);
  }

  private async generateAndStoreTokens(user: User) {
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES as any }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES as any }
    );

    const tokenHash = await this.hashPassword(refreshToken);
    await redis.set(`refresh:${user.id}`, tokenHash, 'EX', 30 * 24 * 60 * 60);

    return { accessToken, refreshToken };
  }
}
