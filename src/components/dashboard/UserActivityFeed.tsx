
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface UserActivity {
  id: string;
  activity_type: string;
  details: Record<string, any>;
  created_at: string;
}

export const UserActivityFeed = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-activity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as UserActivity[];
    },
  });

  const getActivityMessage = (activity: UserActivity) => {
    switch (activity.activity_type) {
      case 'credit_purchase':
        return `Purchased ${activity.details.amount} credits`;
      case 'credit_usage':
        return `Used ${activity.details.amount} credits for ${activity.details.purpose}`;
      case 'agent_interaction':
        return `Interacted with agent: ${activity.details.agent_name}`;
      default:
        return activity.activity_type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
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
                <div className="flex-1">
                  <p className="font-medium">{getActivityMessage(activity)}</p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </time>
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
