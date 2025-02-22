
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueBreakdown } from "@/components/developer/RevenueBreakdown";
import { SystemHealth } from "@/components/developer/SystemHealth";
import { ActiveUserTrends } from "@/components/developer/ActiveUserTrends";
import { IncidentTracker } from "@/components/developer/IncidentTracker";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, Users, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const DeveloperOverview = () => {
  const navigate = useNavigate();

  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['developer', 'revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_analytics')
        .select('*')
        .order('hour', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data[0];
    },
    staleTime: 30000,
  });

  const { data: activeUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['developer', 'activeUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_metrics')
        .select('daily_active_users')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data[0]?.daily_active_users || 0;
    },
    staleTime: 60000,
  });

  const { data: systemHealth, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['developer', 'systemHealth'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployments')
        .select('uptime_percentage')
        .order('last_health_check', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data[0]?.uptime_percentage || 100;
    },
    staleTime: 30000,
  });

  if (isLoadingRevenue || isLoadingUsers || isLoadingHealth) {
    return (
      <DashboardLayout type="developer">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Developer Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Developer Overview</h2>
          <Button 
            variant="outline"
            onClick={() => navigate('/developer/agents/create')}
          >
            Create New Agent
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${revenueData?.total_revenue?.toFixed(2) || '0.00'}`}
            icon={DollarSign}
            description={
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => navigate('/developer/revenue')}
              >
                View Revenue Details
              </Button>
            }
          />
          <StatsCard
            title="Active Users"
            value={activeUsers || 0}
            icon={Users}
            description={
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => navigate('/developer/analytics')}
              >
                View Analytics
              </Button>
            }
          />
          <StatsCard
            title="System Health"
            value={`${systemHealth?.toFixed(1)}%`}
            icon={Activity}
            description={
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => navigate('/developer/monitoring')}
              >
                View Monitoring
              </Button>
            }
          />
          <StatsCard
            title="Transactions"
            value={revenueData?.transaction_count || 0}
            icon={ChartBar}
            description={
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => navigate('/developer/transactions')}
              >
                View All
              </Button>
            }
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RevenueBreakdown />
          <ActiveUserTrends />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SystemHealth />
          <IncidentTracker />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperOverview;
