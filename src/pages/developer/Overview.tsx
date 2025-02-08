
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueBreakdown } from "@/components/developer/RevenueBreakdown";
import { SystemHealth } from "@/components/developer/SystemHealth";
import { ActiveUserTrends } from "@/components/developer/ActiveUserTrends";
import { IncidentTracker } from "@/components/developer/IncidentTracker";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, Users, DollarSign, Activity } from "lucide-react";

const DeveloperOverview = () => {
  const { data: revenueData } = useQuery({
    queryKey: ['developer', 'revenue'],
    queryFn: async () => {
      console.log('Fetching revenue data...');
      const { data, error } = await supabase
        .from('revenue_analytics')
        .select('*')
        .order('hour', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching revenue:', error);
        throw error;
      }

      return data[0];
    }
  });

  const { data: activeUsers } = useQuery({
    queryKey: ['developer', 'activeUsers'],
    queryFn: async () => {
      console.log('Fetching active users...');
      const { data, error } = await supabase
        .from('platform_metrics')
        .select('daily_active_users')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching active users:', error);
        throw error;
      }
      
      return data[0]?.daily_active_users || 0;
    }
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['developer', 'systemHealth'],
    queryFn: async () => {
      console.log('Fetching system health...');
      const { data, error } = await supabase
        .from('deployments')
        .select('uptime_percentage')
        .order('last_health_check', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching system health:', error);
        throw error;
      }
      
      return data[0]?.uptime_percentage || 100;
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Developer Overview</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${revenueData?.total_revenue?.toFixed(2) || '0.00'}`}
            icon={DollarSign}
            description="Recent revenue from all agents"
          />
          <StatsCard
            title="Active Users"
            value={activeUsers || 0}
            icon={Users}
            description="Users active in the last 24h"
          />
          <StatsCard
            title="System Health"
            value={`${systemHealth?.toFixed(1)}%`}
            icon={Activity}
            description="Overall system health"
          />
          <StatsCard
            title="Transactions"
            value={revenueData?.transaction_count || 0}
            icon={ChartBar}
            description="Recent transactions"
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
