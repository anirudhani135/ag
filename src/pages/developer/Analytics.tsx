import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  // Fetch usage metrics
  const { data: usageData } = useQuery({
    queryKey: ['developer', 'usage'],
    queryFn: async () => {
      console.log('Fetching usage metrics...');
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('date, views, unique_views')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching usage metrics:', error);
        throw error;
      }

      return data.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        value: item.views || 0
      }));
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics</h2>

        {/* Usage Chart */}
        <PerformanceChart
          data={usageData || []}
          title="Daily Usage"
          className="mt-6"
        />

        {/* User Engagement */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
          <p className="text-muted-foreground">Detailed metrics coming soon...</p>
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
          <p className="text-muted-foreground">Geographic data coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;