import { useState, useEffect, useCallback } from 'react';
import { socket } from '@/socket/socket';

import { toast } from 'sonner';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      // Only show toast if we are reconnecting after a drop
      if (sessionStorage.getItem('socket_dropped') === 'true') {
        toast.success('Connection restored.');
        sessionStorage.removeItem('socket_dropped');
      }
    };
    
    const handleDisconnect = () => {
      setIsConnected(false);
      sessionStorage.setItem('socket_dropped', 'true');
      toast.error('Connection lost — reconnecting...', { duration: 10000 });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socket.emit(event, data);
  }, []);

  /**
   * Helper hook to handle a one-off socket listener with automatic cleanup
   */
  const useSocketEvent = (event: string, callback: (...args: any[]) => void) => {
    useEffect(() => {
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    }, [event, callback]);
  };

  return {
    isConnected,
    socket,
    emit,
    useSocketEvent,
  };
};
