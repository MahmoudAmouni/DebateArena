import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useNotificationContext } from '@/context/NotificationContext';
import { socket } from '@/socket/socket';
import { api } from '@/api/apiClient';

export const useNotifications = () => {
  const { unreadCount, incrementUnread, clearUnread } = useNotificationContext();

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post('/notifications/mark-read');
      clearUnread();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  }, [clearUnread]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: { message: string; type?: string }) => {
      incrementUnread();
      
      // Professional toast alert using sonner
      toast(data.message || 'You have a new notification', {
        description: data.type === 'challenge' ? 'A new debate challenge awaits!' : undefined,
        action: {
          label: 'View',
          onClick: () => console.log('Navigate to notifications'),
        },
      });
    };

    const handleNotificationsCleared = () => {
      clearUnread();
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('notifications_cleared', handleNotificationsCleared);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('notifications_cleared', handleNotificationsCleared);
    };
  }, [incrementUnread, clearUnread]);

  return {
    unreadCount,
    markAllAsRead,
  };
};
