
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, RefreshCw, Trash, Filter, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: string;
  data?: Record<string, any>;
}

interface NotificationsCenterProps {
  filterType?: "all" | "read" | "unread";
}

export const NotificationsCenter = ({ filterType = "all" }: NotificationsCenterProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  const { data: notifications, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['notifications', filterType, sortOrder, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: sortOrder === 'asc' });
      
      if (filterType === 'read') {
        query = query.eq('read', true);
      } else if (filterType === 'unread') {
        query = query.eq('read', false);
      }
      
      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }
      
      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data as Notification[];
    },
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    // Set up subscription to new notifications
    const channel = supabase
      .channel('notification-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          // When a new notification is added, invalidate the query to refresh the list
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          // Show toast for new notification
          toast({
            title: "New Notification",
            description: payload.new.title,
            variant: "default",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not mark notification as read",
        variant: "destructive",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not delete notification",
        variant: "destructive",
      });
    },
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const deleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not mark notifications as read",
        variant: "destructive",
      });
    }
  };

  const getNotificationTypes = () => {
    if (!notifications) return [];
    const types = new Set(notifications.map(n => n.type));
    return Array.from(types);
  };

  return (
    <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h3 className="text-lg font-semibold">
              {filterType === "all" ? "All Notifications" : 
               filterType === "read" ? "Read Notifications" : "Unread Notifications"}
            </h3>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 px-2 lg:px-3"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                  Newest First {sortOrder === "desc" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                  Oldest First {sortOrder === "asc" && "✓"}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                  All Types {typeFilter === null && "✓"}
                </DropdownMenuItem>
                {getNotificationTypes().map(type => (
                  <DropdownMenuItem 
                    key={type} 
                    onClick={() => setTypeFilter(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} {typeFilter === type && "✓"}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => {
                  setTypeFilter(null);
                  setSortOrder("desc");
                }}>
                  Reset Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 px-2 lg:px-3"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
            
            {filterType !== 'read' && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 px-2 lg:px-3"
                onClick={markAllAsRead}
                disabled={!notifications?.some(n => !n.read)}
              >
                <Check className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Mark All Read</span>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))
          ) : notifications?.length ? (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0 
                    ${notification.read ? 'opacity-70' : 'bg-primary/5 p-3 rounded-md -m-3'}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{notification.title}</p>
                      {notification.type && (
                        <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </Badge>
                      )}
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <time className="text-xs text-muted-foreground block">
                        {format(new Date(notification.created_at), 'MMM d, yyyy')} 
                        ({formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })})
                      </time>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 hover:bg-primary/10 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground opacity-50"
                        disabled
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
              <p className="text-muted-foreground">No notifications found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {filterType === 'all' ? 'You don\'t have any notifications yet.' :
                 filterType === 'read' ? 'You don\'t have any read notifications.' : 'You don\'t have any unread notifications.'}
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
