import prisma from '../../config/database';
import { NotificationType } from '@prisma/client';
import logger from '../../config/logger';

export class NotificationsService {
  async send(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    referenceId?: string,
    referenceType?: string
  ) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          body,
          referenceId,
          referenceType,
        }
      });

      return notification;
    } catch (error) {
      logger.error('Failed to send notification:', error);
      throw error;
    }
  }
}

export const notificationsService = new NotificationsService();
