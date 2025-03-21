
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from './NotificationProvider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';

export const NotificationIcon = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // Additional actions could be added here (e.g., navigation)
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="h-2 w-2 rounded-full bg-green-500" />;
      case 'error':
        return <div className="h-2 w-2 rounded-full bg-red-500" />;
      case 'warning':
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px]">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-3 hover:bg-muted/50 cursor-pointer transition-colors",
                      !notification.read && "bg-muted/20"
                    )}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mr-2 hover:bg-muted opacity-60 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                          >
                            <span className="sr-only">Dismiss</span>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <time className="text-xs text-muted-foreground" dateTime={notification.timestamp.toISOString()}>
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
