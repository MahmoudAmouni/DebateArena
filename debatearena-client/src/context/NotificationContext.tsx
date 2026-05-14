import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/api/apiClient';
import { useAuthContext } from './AuthContext';

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCountState] = useState(0);
  const { user } = useAuthContext();

  const setUnreadCount = useCallback((count: number) => {
    setUnreadCountState(count);
  }, []);

  const incrementUnread = useCallback(() => {
    setUnreadCountState((prev) => prev + 1);
  }, []);

  const clearUnread = useCallback(() => {
    setUnreadCountState(0);
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get('/notifications/unread-count'); // Assuming this endpoint exists
      if (response.data) {
        setUnreadCountState(response.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    } else {
      setUnreadCountState(0);
    }
  }, [user, fetchUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, incrementUnread, clearUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
