import { UsersRepository } from './users.repository';
import { NotFoundError, ConflictError } from '../../utils/errors';
import prisma from '../../config/database';

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  private stripPassword(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async getOwnProfile(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    return {
      ...this.stripPassword(user),
      badges: [],
      topicRatings: [],
      recentDebates: [],
    };
  }

  async getPublicProfile(username: string) {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    const { passwordHash, ...pub } = user as any;
    return pub;
  }

  async getLeaderboard(cursor?: string, limit = 20) {
    const results = await this.usersRepository.getLeaderboard(cursor, limit);
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;
    return { data, nextCursor: hasMore ? data[data.length - 1].id : null };
  }

  async getCategoryLeaderboard(categorySlug: string, cursor?: string, limit = 20) {
    const results = await this.usersRepository.getCategoryLeaderboard(categorySlug, cursor, limit);
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;
    return { data, nextCursor: hasMore ? (data[data.length - 1] as any).id : null };
  }

  async getDebateHistory(userId: string, cursor?: string, limit = 10) {
    const results = await this.usersRepository.getDebateHistory(userId, cursor, limit);
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;
    return { data, nextCursor: hasMore ? data[data.length - 1].id : null };
  }

  async getBadges(userId: string) {
    return this.usersRepository.getUserBadges(userId);
  }

  async getNotifications(userId: string) {
    return this.usersRepository.getNotifications(userId);
  }

  async markNotificationRead(notificationId: string, userId: string) {
    return this.usersRepository.markNotificationRead(notificationId, userId);
  }

  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) throw new ConflictError('Cannot block yourself', 'CANNOT_BLOCK_SELF');
    const existing = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } }
    });
    if (existing) throw new ConflictError('Already blocked', 'ALREADY_BLOCKED');
    return this.usersRepository.createBlock(blockerId, blockedId);
  }

  async unblockUser(blockerId: string, blockedId: string) {
    return this.usersRepository.deleteBlock(blockerId, blockedId);
  }
}
