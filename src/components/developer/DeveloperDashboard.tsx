
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider } from "@/context/DashboardContext";
import { supabase } from "@/integrations/supabase/client";
import { type DeveloperDashboardMetrics } from "@/types/dashboard";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedSuspense } from "@/components/utils/OptimizedSuspense";

// Lazy loaded components for better code splitting
const DeveloperDashboardHeader = lazy(() => import("./dashboard/DashboardHeader").then(mod => ({ default: mod.DeveloperDashboardHeader })));
const QuickStatsGrid = lazy(() => import("./dashboard/QuickStatsGrid").then(mod => ({ default: mod.QuickStatsGrid })));
const DeveloperActionsSection = lazy(() => import("./dashboard/ActionsSection").then(mod => ({ default: mod.DeveloperActionsSection })));
const DashboardMetricsSection = lazy(() => import("./dashboard/DashboardMetricsSection").then(mod => ({ default: mod.DashboardMetricsSection })));

interface ActivityMetadata {
  agent_name?: string;
  status?: string;
  [key: string]: any;
}

type TransactionRow = {
  amount: number;
};

type ReviewRow = {
  rating: number;
};

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

      // Fetch published agents count
      const { count: publishedAgents } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('developer_id', user.id)
        .eq('status', 'published');

      // Fetch monthly revenue
      const { data: monthlyRevenue } = await supabase
        .from('transactions')
        .select('amount');
      const typedRevenue = (monthlyRevenue || []) as TransactionRow[];
      const totalRevenue = typedRevenue
        .reduce((acc, curr) => acc + curr.amount, 0);

      // Fetch agent ratings
      const { data: ratings } = await supabase
        .from('reviews')
        .select('rating');
      const typedRatings = (ratings || []) as ReviewRow[];
      const averageRating = typedRatings.length 
        ? typedRatings.reduce((acc, curr) => acc + curr.rating, 0) / typedRatings.length 
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
    staleTime: 60 * 1000, // Cache for 1 minute for better performance
  });

  return (
    <DashboardProvider type="developer">
      <DashboardLayout type="developer">
        <div className="space-y-6 p-6 animate-fade-in">
          <OptimizedSuspense fallback={<Skeleton className="h-16 w-full" />} delay={100}>
            <DeveloperDashboardHeader 
              userName={dashboardData?.userName}
              lastLoginDate={dashboardData?.lastLoginDate}
            />
          </OptimizedSuspense>

          <OptimizedSuspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>} delay={150}>
            <QuickStatsGrid 
              creditBalance={dashboardData?.availableBalance || 0}
              activeAgents={dashboardData?.publishedAgents || 0}
              monthlyRevenue={dashboardData?.monthlyRevenue || 0}
              averageRating={dashboardData?.averageRating || 0}
            />
          </OptimizedSuspense>

          <OptimizedSuspense fallback={<Skeleton className="h-20 w-full" />} delay={200}>
            <DeveloperActionsSection />
          </OptimizedSuspense>

          <OptimizedSuspense fallback={<div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>} delay={250}>
            <DashboardMetricsSection 
              activities={dashboardData?.recentActivity}
              isLoading={isLoading}
            />
          </OptimizedSuspense>
        </div>
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default DeveloperDashboard;
