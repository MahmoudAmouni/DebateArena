import prisma from '../../config/database';
import { NotFoundError, ForbiddenError } from '../../utils/errors';
import { ReportStatus, ReportReason } from '@prisma/client';
import logger from '../../config/logger';

export class ModerationService {
  async scanMessage(content: string) {
    return { flagged: false, reason: null };
  }

  async handleViolation(userId: string, reason: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        warningCount: { increment: 1 }
      }
    });

    if (user.warningCount >= 3) {
      const banExpiresAt = new Date();
      banExpiresAt.setHours(banExpiresAt.getHours() + 24);

      await prisma.user.update({
        where: { id: userId },
        data: {
          banExpiresAt,
          warningCount: 0 
        }
      });
      
      logger.info(`User ${userId} suspended for 24h due to 3 warnings`);
    }

    return user;
  }

  async submitReport(reporterId: string, data: {
    reportedUserId: string;
    sessionId?: string;
    messageId?: string;
    reason: ReportReason;
    details?: string;
  }) {
    return prisma.report.create({
      data: {
        reporterId,
        ...data,
        status: ReportStatus.pending
      }
    });
  }

  async reviewReport(adminId: string, reportId: string, action: 'actioned' | 'dismissed') {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundError('Report not found');

    if (action === 'actioned') {
      await this.handleViolation(report.reportedUserId, report.reason);
    }

    return prisma.report.update({
      where: { id: reportId },
      data: {
        status: action === 'actioned' ? ReportStatus.actioned : ReportStatus.dismissed,
        reviewedBy: adminId,
        reviewedAt: new Date()
      }
    });
  }

  async getReports(status: ReportStatus = ReportStatus.pending) {
    return prisma.report.findMany({
      where: { status },
      include: {
        reporter: { select: { username: true } },
        reportedUser: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async warnUser(userId: string) {
    return this.handleViolation(userId, 'ADMIN_WARNING');
  }

  async suspendUser(userId: string, hours: number = 24) {
    const banExpiresAt = new Date();
    banExpiresAt.setHours(banExpiresAt.getHours() + hours);

    return prisma.user.update({
      where: { id: userId },
      data: { banExpiresAt }
    });
  }

  async banUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isBanned: true }
    });
  }
}

export const moderationService = new ModerationService();
