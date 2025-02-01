import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
}

export const ActivityFeed = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Map the database response to match our interface
      return (data || []).map(item => ({
        id: item.id,
        type: item.log_type || 'unknown',
        message: item.message || '',
        created_at: item.created_at || new Date().toISOString()
      })) as ActivityItem[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground">Loading activities...</p>
          ) : activities?.length ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="w-full">
                  <p className="font-medium">{activity.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">
                      {activity.type}
                    </span>
                    <time className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};