
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DashboardProvider } from "@/context/DashboardContext";
import { StatsCard } from "./dashboard/StatsCard";
import { UserActivityFeed } from "./dashboard/UserActivityFeed";
import { NotificationsCenter } from "./dashboard/NotificationsCenter";
import { CreditUsageChart } from "./dashboard/CreditUsageChart";
import { Button } from "./ui/button";
import { Plus, DollarSign, Users, Activity, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface DashboardProps {
  type?: "user" | "developer";
}

export const Dashboard = ({ type = "user" }: DashboardProps) => {
  const navigate = useNavigate();
  
  const { data: profile } = useQuery({
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

  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics', type],
    queryFn: async () => {
      if (type === "developer") {
        const { data, error } = await supabase
          .from('agent_metrics')
          .select('*')
          .eq('date', new Date().toISOString().split('T')[0]);

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('user_engagement_metrics')
          .select('*')
          .eq('user_id', profile?.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        return data?.[0];
      }
    },
    enabled: !!profile?.id,
  });

  // Redirect if user doesn't have the correct role
  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (type === "developer" && roles?.role !== 'developer') {
        navigate('/dashboard');
      }
    };

    checkRole();
  }, [type, navigate]);

  const renderMetrics = () => {
    if (type === "developer") {
      return (
        <>
          <StatsCard
            title="Total Revenue"
            value={`$${metrics?.revenue || 0}`}
            icon={DollarSign}
            description="View Revenue Details"
          />
          <StatsCard
            title="Active Users"
            value={metrics?.unique_views || 0}
            icon={Users}
            description="View User Analytics"
          />
          <StatsCard
            title="Agent Performance"
            value={`${metrics?.conversion_rate || 0}%`}
            icon={Activity}
            description="View Performance Details"
          />
          <StatsCard
            title="Total Agents"
            value={metrics?.agent_count || 0}
            icon={Bot}
            description="Manage Your Agents"
          />
        </>
      );
    }

    return (
      <>
        <StatsCard
          title="Available Credits"
          value={profile?.credit_balance || 0}
          icon={DollarSign}
          description={
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => navigate('/dashboard/credits')}
            >
              Buy More Credits
            </Button>
          }
        />
        <StatsCard
          title="Active Agents"
          value={metrics?.active_agents || 0}
          icon={Bot}
          description="View Your Agents"
        />
        <StatsCard
          title="Total Usage"
          value={`${metrics?.total_interactions || 0} calls`}
          icon={Activity}
          description="View Analytics"
        />
      </>
    );
  };

  return (
    <DashboardProvider type={type}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {type === "developer" ? "Developer Dashboard" : "Dashboard"}
              </h2>
              <p className="text-muted-foreground">
                {type === "developer" 
                  ? "Monitor your agent performance and manage your account"
                  : "Welcome back! Here's what's happening with your AI agents"
                }
              </p>
            </div>
            
            <Button 
              className={cn(
                "gap-2",
                type === "developer" ? "bg-teal-600 hover:bg-teal-700" : "bg-orange-500 hover:bg-orange-600"
              )}
              onClick={() => navigate(type === "developer" ? "/developer/agents/new" : "/marketplace")}
            >
              <Plus className="h-4 w-4" />
              {type === "developer" ? "Create Agent" : "Get New Agent"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {renderMetrics()}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <CreditUsageChart />
              <UserActivityFeed />
            </div>
            <NotificationsCenter />
          </div>
        </div>
      </DashboardLayout>
    </DashboardProvider>
  );
};
