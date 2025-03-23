
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext'; // Changed from MockAuthContext to AuthContext
import { useToast } from '@/hooks/use-toast';
import { Bell, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        setNotifications(data as Notification[] || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // In development mode, provide sample notifications
        if (import.meta.env.DEV) {
          setNotifications([
            {
              id: 'sample1',
              title: 'Welcome to the platform',
              message: 'This is a sample notification for development purposes.',
              type: 'info',
              created_at: new Date().toISOString(),
              read: false
            },
            {
              id: 'sample2',
              title: 'New feature available',
              message: 'Check out our new dashboard features.',
              type: 'success',
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              read: true
            }
          ]);
        }
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    let channel: any = null;
    
    if (user) {
      try {
        channel = supabase
          .channel(`notifications:${user.id}`)
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications((prev) => [newNotification, ...prev]);
            
            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
              duration: 5000,
            });
          })
          .subscribe();
      } catch (error) {
        console.error('Error subscribing to notifications:', error);
      }
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      }
    };
  }, [user, toast]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      // In development mode, update the local state only
      if (import.meta.env.DEV) {
        setNotifications((prev) => 
          prev.map((notification) => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications((prev) => 
        prev.map((notification) => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      // In development mode, update the local state only
      if (import.meta.env.DEV) {
        setNotifications((prev) => 
          prev.map((notification) => ({ ...notification, read: true }))
        );
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      setNotifications((prev) => 
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotification = async (id: string) => {
    if (!user) return;
    
    try {
      // In development mode, update the local state only
      if (import.meta.env.DEV) {
        setNotifications((prev) => 
          prev.filter((notification) => notification.id !== id)
        );
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications((prev) => 
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
