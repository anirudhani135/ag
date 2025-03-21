
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { subscribeToHealthUpdates, subscribeToRevenue } from "@/lib/realtimeSubscriptions";
import { Bell, Check, X, AlertTriangle, Info } from "lucide-react";

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotification: () => {},
  clearAllNotifications: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear a specific notification
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Function to add a new notification
  const addNotification = (title: string, message: string, type: NotificationType = 'info', data?: any) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      data
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for immediate visibility
    toast[type]?.(title, {
      description: message,
      action: {
        label: "View",
        onClick: () => markAsRead(newNotification.id)
      },
    });
  };

  // WebSocket subscriptions for real-time updates
  useEffect(() => {
    // Subscribe to deployment health status changes
    const healthChannel = subscribeToHealthUpdates((payload) => {
      if (payload.new) {
        const { agent_id, health_status, alert_status } = payload.new;
        
        // Generate notification based on health status change
        if (health_status === 'unhealthy') {
          addNotification(
            'Agent Health Alert', 
            `Agent ${agent_id} is experiencing issues.`, 
            'error',
            payload.new
          );
        } else if (alert_status === 'warning') {
          addNotification(
            'Agent Performance Warning', 
            `Agent ${agent_id} has degraded performance.`, 
            'warning',
            payload.new
          );
        }
      }
    });

    // Subscribe to revenue updates
    const revenueChannel = subscribeToRevenue((payload) => {
      if (payload.new) {
        const { total_revenue, daily_active_users, successful_transactions } = payload.new;
        
        // Generate notification for significant revenue changes
        if (successful_transactions > 10) {
          addNotification(
            'Revenue Milestone', 
            `Reached ${successful_transactions} transactions!`, 
            'success',
            payload.new
          );
        }
      }
    });

    // Cleanup function
    return () => {
      supabase.removeChannel(healthChannel);
      supabase.removeChannel(revenueChannel);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      clearNotification, 
      clearAllNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
