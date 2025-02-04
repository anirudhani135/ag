import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueBreakdown } from "@/components/developer/RevenueBreakdown";
import { SystemHealth } from "@/components/developer/SystemHealth";
import { ActiveUserTrends } from "@/components/developer/ActiveUserTrends";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, Users, DollarSign, Activity } from "lucide-react";

const DeveloperOverview = () => {
  // Fetch revenue data
  const { data: revenueData } = useQuery({
    queryKey: ['developer', 'revenue'],
    queryFn: async () => {
      console.log('Fetching revenue data...');
      const { data, error } = await supabase
        .from('purchases')
        .select('created_at, amount')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching revenue:', error);
        throw error;
      }

      // Group by date and sum amounts
      const groupedData = data.reduce((acc: any[], curr) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.value += curr.amount;
        } else {
          acc.push({ date, value: curr.amount });
        }
        return acc;
      }, []);

      return groupedData;
    }
  });

  const { data: activeUsers } = useQuery({
    queryKey: ['developer', 'activeUsers'],
    queryFn: async () => {
      console.log('Fetching active users...');
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .filter('last_active', 'gte', new Date(Date.now() - 24*60*60*1000).toISOString());
      
      if (error) {
        console.error('Error fetching active users:', error);
        throw error;
      }
      
      return count || 0;
    }
  });

  // Fetch total agents
  const { data: totalAgents } = useQuery({
    queryKey: ['developer', 'totalAgents'],
    queryFn: async () => {
      console.log('Fetching total agents...');
      const { count, error } = await supabase
        .from('agents')
        .select('*', { count: 'exact' });
      
      if (error) {
        console.error('Error fetching total agents:', error);
        throw error;
      }
      
      return count || 0;
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Developer Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${revenueData?.reduce((sum, item) => sum + item.value, 0)?.toFixed(2) || '0.00'}`}
            icon={DollarSign}
            description="Total revenue from all agents"
          />
          <StatsCard
            title="Active Users"
            value={activeUsers || 0}
            icon={Users}
            description="Users active in the last 24h"
          />
          <StatsCard
            title="Total Agents"
            value={totalAgents || 0}
            icon={ChartBar}
            description="Total number of agents"
          />
          <StatsCard
            title="System Health"
            value="98.5%"
            icon={Activity}
            description="Overall system health"
          />
        </div>

        {/* Enhanced Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueBreakdown />
          <ActiveUserTrends />
        </div>

        {/* System Health */}
        <SystemHealth />
      </div>
    </DashboardLayout>
  );
};

export default DeveloperOverview;
