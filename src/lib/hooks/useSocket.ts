import { useEffect, useCallback } from 'react';
import socket from '@/lib/socket';
import { useAuth } from "@/components/providers/AuthProvider";

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { user } = useAuth();

  const connect = useCallback(() => {
    if (!user) return;
    socket.auth = { token: user.id };
    socket.connect();
  }, [user]);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Set up event listeners
    socket.on('connect', () => {
      console.log('Socket connected');
      options.onConnect?.();
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      options.onDisconnect?.();
    });

    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
      options.onError?.(error);
    });

    // Connect if not already connected
    if (!socket.connected) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      disconnect();
    };
  }, [user, connect, disconnect, options]);

  return {
    socket,
    connect,
    disconnect,
    isConnected: socket.connected,
  };
} 