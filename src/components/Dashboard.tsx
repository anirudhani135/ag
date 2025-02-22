
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider } from "@/context/DashboardContext";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserActivityFeed } from "@/components/dashboard/UserActivityFeed";
import { CreditUsageChart } from "@/components/dashboard/CreditUsageChart";
import {
  Coins,
  Bot,
  BarChart2,
  Star,
  Plus,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { type DashboardMetrics, type UserActivity } from "@/types/dashboard";

interface DashboardProps {
  type?: "user" | "developer";
}

export const Dashboard = ({ type = "user" }: DashboardProps) => {
  const navigate = useNavigate();

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

      const formattedActivity: UserActivity[] = recentActivity?.map(activity => ({
        id: activity.id,
        action: activity.activity_type,
        timestamp: activity.created_at,
        agentName: activity.details?.agent_name || 'Unknown Agent',
        metadata: activity.details,
        status: activity.details?.status
      })) || [];

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

  const lowCredits = (dashboardData?.creditBalance || 0) < 50;

  return (
    <DashboardProvider type="user">
      <DashboardLayout>
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {dashboardData?.userName}!
            </h1>
            <p className="text-muted-foreground">
              Last login: {new Date(dashboardData?.lastLoginDate || '').toLocaleString()}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Available Credits"
              value={dashboardData?.creditBalance || 0}
              icon={Coins}
              description={lowCredits ? "Low balance!" : "Credits remaining"}
              className={cn(
                "transition-all duration-500",
                lowCredits && "animate-pulse border-red-500"
              )}
            />
            <StatsCard
              title="Active Agents"
              value={dashboardData?.activeAgents || 0}
              icon={Bot}
              description="Currently active"
              className="hover:shadow-lg transition-shadow"
            />
            <StatsCard
              title="Usage This Month"
              value={`${dashboardData?.monthlyUsage || 0} calls`}
              icon={BarChart2}
              description="API Usage"
            />
            <StatsCard
              title="Average Rating"
              value={`${dashboardData?.averageRating.toFixed(1)}/5.0`}
              icon={Star}
              description="Based on your reviews"
              className="hover:shadow-lg transition-shadow"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/dashboard/credits')}
            >
              <Coins className="w-5 h-5 mr-2" />
              Buy Credits
            </Button>
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/marketplace')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Browse Agents
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Credit Usage History</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => navigate('/dashboard/credits')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <CreditUsageChart />
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => navigate('/dashboard/activity')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <UserActivityFeed 
                activities={dashboardData?.recentActivity}
                isLoading={isLoading}
              />
            </Card>
          </div>

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
