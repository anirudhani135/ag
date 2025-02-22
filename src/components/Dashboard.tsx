
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider } from "@/context/DashboardContext";
import { supabase } from "@/integrations/supabase/client";
import { type DashboardMetrics, type UserActivity } from "@/types/dashboard";
import { Database } from "@/integrations/supabase/types";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardStatsGrid } from "./dashboard/DashboardStatsGrid";
import { QuickActions } from "./dashboard/QuickActions";
import { DashboardMetricsPanel } from "./dashboard/DashboardMetricsPanel";

type DbUserActivity = Database["public"]["Tables"]["user_activity"]["Row"];

const parseActivityDetails = (details: any): { 
  agent_name?: string; 
  status?: 'success' | 'warning' | 'error'; 
  [key: string]: any; 
} => {
  if (typeof details === 'object' && details !== null) {
    return details;
  }
  try {
    return JSON.parse(details as string);
  } catch {
    return {};
  }
};

const formatUserActivity = (activity: DbUserActivity): UserActivity => {
  const details = parseActivityDetails(activity.details);
  const status = details?.status;
  
  // Ensure status is one of the allowed values
  const validStatus = status === 'success' || status === 'warning' || status === 'error' 
    ? status 
    : undefined;
  
  return {
    id: activity.id,
    action: activity.activity_type,
    timestamp: activity.created_at,
    agentName: details?.agent_name || 'Unknown Agent',
    metadata: details || {},
    status: validStatus
  };
};

interface DashboardProps {
  type?: "user" | "developer";
}

export const Dashboard = ({ type = "user" }: DashboardProps) => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch active agents count
      const { count: activeAgents } = await supabase
        .from('agent_metrics')
        .select('agent_id', { count: 'exact', head: true })
        .eq('date', new Date().toISOString().split('T')[0])
        .gt('views', 0);

      // Fetch monthly usage
      const { data: monthlyUsage } = await supabase
        .from('user_engagement_metrics')
        .select('session_duration')
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().setDate(1)).toISOString())
        .single();

      // Fetch average rating
      const { data: ratings } = await supabase
        .from('reviews')
        .select('rating')
        .eq('user_id', user.id);

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

      const formattedActivity = (recentActivity || []).map(formatUserActivity);

      return {
        creditBalance: profile?.credit_balance || 0,
        activeAgents: activeAgents || 0,
        monthlyUsage: monthlyUsage?.session_duration || 0,
        averageRating,
        lastLoginDate: profile?.last_login || new Date().toISOString(),
        userName: profile?.name || 'User',
        unreadNotifications: unreadNotifications || 0,
        recentActivity: formattedActivity
      } as DashboardMetrics;
    },
  });

  return (
    <DashboardProvider type={type}>
      <DashboardLayout>
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

          <QuickActions type={type} />

          <DashboardMetricsPanel 
            activities={dashboardData?.recentActivity}
            isLoading={isLoading}
          />

          {/* Expandable Section for Future Features */}
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <p className="text-muted-foreground">More features coming soon!</p>
          </div>
        </div>
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default Dashboard;
