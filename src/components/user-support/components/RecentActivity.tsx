
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from './LoadingSpinner';

interface TicketActivity {
  id: string;
  ticket_id: string;
  content: string;
  type: string;
  created_at: string;
}

const RecentActivity = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['ticket-activities'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('ticket_activities')
        .select('*')
        .eq('user_id', user.data.user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as TicketActivity[];
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      {activities?.length ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <p className="text-sm text-muted-foreground">
                {activity.content}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>No recent activity</p>
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
