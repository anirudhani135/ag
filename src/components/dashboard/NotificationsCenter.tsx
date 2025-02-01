import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const NotificationsCenter = () => {
  const { toast } = useToast();
  
  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Notification[];
    },
  });

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not mark notification as read",
        variant: "destructive",
      });
    } else {
      refetch();
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground">Loading notifications...</p>
          ) : notifications?.length ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0 ${
                  notification.read ? 'opacity-60' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <time className="text-xs text-muted-foreground block mt-2">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </time>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No new notifications</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};