
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider } from "@/context/DashboardContext";
import { supabase } from "@/integrations/supabase/client";
import { type DashboardMetrics } from "@/types/dashboard";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardStatsGrid } from "./dashboard/DashboardStatsGrid";
import { QuickActions } from "./dashboard/QuickActions";
import { DashboardMetricsPanel } from "./dashboard/DashboardMetricsPanel";

export const Dashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['user-dashboard-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch active agents count
      const { count: activeAgents } = await supabase
        .from('user_agents')
        .select('agent_id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Fetch monthly usage
      const { data: monthlyUsage } = await supabase
        .from('user_engagement_metrics')
        .select('session_duration')
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().setDate(1)).toISOString())
        .single();

      // Fetch user rating
      const { data: ratings } = await supabase
        .from('reviews')
        .select('rating')
        .eq('user_id', user.id);

      const averageRating = ratings?.length 
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
        : 0;

      // Fetch recent activity
      const { data: recentActivity } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        creditBalance: profile?.credit_balance || 0,
        activeAgents: activeAgents || 0,
        monthlyUsage: monthlyUsage?.session_duration || 0,
        averageRating,
        lastLoginDate: profile?.last_login || new Date().toISOString(),
        userName: profile?.name || 'User',
        recentActivity: recentActivity || []
      } as DashboardMetrics;
    },
  });

  return (
    <DashboardProvider type="user">
      <DashboardLayout type="user">
        <div className="space-y-6 p-6">
          <DashboardHeader 
            userName={dashboardData?.userName}
            lastLoginDate={dashboardData?.lastLoginDate}
          />

          <DashboardStatsGrid 
            creditBalance={dashboardData?.creditBalance || 0}
            activeAgents={dashboardData?.activeAgents || 0}
            monthlyUsage={dashboardData?.monthlyUsage || 0}
            averageRating={dashboardData?.averageRating || 0}
          />

          <QuickActions type="user" />

          <DashboardMetricsPanel 
            activities={dashboardData?.recentActivity}
            isLoading={isLoading}
          />
        </div>
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default Dashboard;
