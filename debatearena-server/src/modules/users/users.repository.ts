import prisma from '../../config/database';
import { Prisma, User } from '@prisma/client';

export class UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async getLeaderboard(cursor?: string, limit = 20) {
    return prisma.user.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { globalElo: 'desc' },
      select: { id: true, username: true, globalElo: true, totalWins: true, totalLosses: true, avatarUrl: true }
    });
  }

  async getCategoryLeaderboard(categorySlug: string, cursor?: string, limit = 20) {
    return prisma.userTopicRating.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: { category: { slug: categorySlug } },
      orderBy: { elo: 'desc' },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } }
    });
  }

  async getDebateHistory(userId: string, cursor?: string, limit = 10) {
    return prisma.sessionParticipant.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: { userId },
      orderBy: { joinedAt: 'desc' },
      include: {
        session: {
          include: {
            category: true,
            verdict: { include: { winner: { include: { user: { select: { username: true } } } } } }
          }
        }
      }
    });
  }

  async getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    });
  }

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
  }

  async markNotificationRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true }
    });
  }

  async createBlock(blockerId: string, blockedId: string) {
    return prisma.block.create({ data: { blockerId, blockedId } });
  }

  async deleteBlock(blockerId: string, blockedId: string) {
    return prisma.block.deleteMany({ where: { blockerId, blockedId } });
  }
}
