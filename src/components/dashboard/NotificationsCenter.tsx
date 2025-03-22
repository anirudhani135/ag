
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle, AlertCircle, Info, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { NotificationItem } from '@/types/dashboard';

interface NotificationsCenterProps {
  filterType?: 'all' | 'unread' | 'read';
  limit?: number;
}

export const NotificationsCenter = ({
  filterType = 'all',
  limit = 5
}: NotificationsCenterProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id, filterType, limit],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (filterType === 'unread') {
        query = query.eq('read', false);
      } else if (filterType === 'read') {
        query = query.eq('read', true);
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as NotificationItem[];
    },
    staleTime: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification marked as read",
        description: "This notification has been marked as read.",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "All notifications marked as read",
        description: "All your unread notifications have been marked as read.",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  return (
    <Card className="overflow-hidden border border-border">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-white pb-2 flex-row justify-between">
        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
        {data.some(n => !n.read) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs font-normal"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-2 items-start">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-6 px-4 flex flex-col items-center">
            <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">
              {filterType === 'unread' 
                ? "No unread notifications" 
                : filterType === 'read' 
                ? "No read notifications"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((notification) => (
              <li 
                key={notification.id} 
                className={`
                  p-3 hover:bg-slate-50 transition-colors 
                  ${!notification.read ? 'bg-blue-50/30' : ''}
                `}
              >
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p 
                      className={`
                        text-xs text-muted-foreground mt-1 
                        ${expandedNotification === notification.id ? '' : 'line-clamp-2'}
                      `}
                    >
                      {notification.message}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs px-2"
                        onClick={() => toggleExpanded(notification.id)}
                      >
                        {expandedNotification === notification.id ? 'Collapse' : 'Expand'}
                      </Button>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs px-2 text-blue-600"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {data.length > 0 && limit && data.length === limit && (
          <div className="p-2 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
              <a href="/dashboard/notifications" className="flex items-center justify-center">
                View all notifications
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
