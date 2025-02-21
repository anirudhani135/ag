
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UserActivityFeed } from "@/components/dashboard/UserActivityFeed";
import { NotificationsCenter } from "@/components/dashboard/NotificationsCenter";
import { CreditUsageChart } from "@/components/dashboard/CreditUsageChart";
import { Coins, Bot, Bell, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DashboardOverview = () => {
  // Fetch user profile data including credit balance
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch active agents count using agent_metrics table
  const { data: activeAgentsCount, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['active-agents-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { count, error } = await supabase
        .from('agent_metrics')
        .select('agent_id', { count: 'exact', head: true })
        .eq('date', new Date().toISOString().split('T')[0])
        .gt('views', 0);

      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch unread notifications count
  const { data: unreadNotificationsCount, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Available Credits"
          value={isLoadingProfile ? "Loading..." : `${profile?.credit_balance || 0}`}
          icon={Coins}
          description={
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => window.location.href = '/dashboard/credits'}
            >
              View Credit History
            </Button>
          }
        />
        <StatsCard
          title="Active Agents"
          value={isLoadingAgents ? "Loading..." : String(activeAgentsCount)}
          icon={Bot}
          description={
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => window.location.href = '/dashboard/agents'}
            >
              View All Agents
            </Button>
          }
        />
        <StatsCard
          title="Notifications"
          value={isLoadingNotifications ? "Loading..." : String(unreadNotificationsCount)}
          icon={Bell}
          description={
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => window.location.href = '/dashboard/notifications'}
            >
              View All
            </Button>
          }
        />
        <StatsCard
          title="24h Activity"
          value="View Details"
          icon={Activity}
          description={
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => window.location.href = '/dashboard/analytics'}
            >
              Analytics
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Credit Usage Chart */}
        <Card className="p-6">
          <CreditUsageChart />
        </Card>

        {/* Activity Feed */}
        <div className="space-y-6">
          <UserActivityFeed />
          <NotificationsCenter />
        </div>
      </div>
    </div>
  );
};
