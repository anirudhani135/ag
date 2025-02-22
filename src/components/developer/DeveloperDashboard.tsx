
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider } from "@/context/DashboardContext";
import { supabase } from "@/integrations/supabase/client";
import { type DeveloperDashboardMetrics } from "@/types/dashboard";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { DashboardStatsGrid } from "../dashboard/DashboardStatsGrid";
import { QuickActions } from "../dashboard/QuickActions";
import { DashboardMetricsPanel } from "../dashboard/DashboardMetricsPanel";

interface ActivityMetadata {
  agent_name?: string;
  status?: string;
  [key: string]: any;
}

interface TransactionData {
  amount: number;
}

interface ReviewData {
  rating: number;
}

export const DeveloperDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['developer-dashboard-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch developer profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      // Fetch published agents count using count with head option
      const { count: publishedAgents } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('developer_id', user.id)
        .eq('status', 'published');

      // Fetch monthly revenue
      const { data: monthlyRevenue } = await supabase
        .from('transactions')
        .select<string, TransactionData>('amount')
        .eq('developer_id', user.id)
        .gte('created_at', new Date(new Date().setDate(1)).toISOString());

      const totalRevenue = monthlyRevenue?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      // Fetch agent ratings
      const { data: ratings } = await supabase
        .from('reviews')
        .select<string, ReviewData>('rating')
        .eq('developer_id', user.id);

      const averageRating = ratings?.length 
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
        : 0;

      // Fetch unread notifications count
      const { count: unreadNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      // Fetch recent activity
      const { data: recentActivity } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const formattedActivity = recentActivity?.map(activity => {
        const metadata = activity.metadata as ActivityMetadata;
        return {
          id: activity.id,
          action: activity.activity_type,
          timestamp: activity.created_at || new Date().toISOString(),
          agentName: metadata?.agent_name || 'Unknown Agent',
          metadata: metadata,
          status: metadata?.status || 'success'
        };
      }) || [];

      return {
        availableBalance: totalRevenue || 0,
        publishedAgents: publishedAgents || 0,
        monthlyRevenue: totalRevenue || 0,
        averageRating,
        lastLoginDate: profile?.last_login || new Date().toISOString(),
        userName: profile?.name || 'Developer',
        unreadNotifications: unreadNotifications || 0,
        recentActivity: formattedActivity
      } as DeveloperDashboardMetrics;
    },
  });

  return (
    <DashboardProvider type="developer">
      <DashboardLayout type="developer">
        <div className="space-y-6 p-6">
          <DashboardHeader 
            userName={dashboardData?.userName}
            lastLoginDate={dashboardData?.lastLoginDate}
          />

          <DashboardStatsGrid 
            creditBalance={dashboardData?.availableBalance || 0}
            activeAgents={dashboardData?.publishedAgents || 0}
            monthlyUsage={dashboardData?.monthlyRevenue || 0}
            averageRating={dashboardData?.averageRating || 0}
          />

          <QuickActions type="developer" />

          <DashboardMetricsPanel 
            activities={dashboardData?.recentActivity}
            isLoading={isLoading}
          />
        </div>
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default DeveloperDashboard;
