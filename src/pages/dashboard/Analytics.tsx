
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Activity, Users, TrendingUp, Clock } from "lucide-react";

const Analytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_engagement_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 60000,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
          <p className="text-muted-foreground">
            Monitor your usage and engagement metrics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Session Duration"
            value={analyticsData?.session_duration ? `${Math.round(analyticsData.session_duration / 60)} min` : '0 min'}
            icon={<Clock className="h-4 w-4" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Features Used"
            value={analyticsData?.features_used ? Object.keys(analyticsData.features_used).length.toString() : '0'}
            icon={<Activity className="h-4 w-4" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Pages Visited"
            value={analyticsData?.pages_visited ? Object.keys(analyticsData.pages_visited).length.toString() : '0'}
            icon={<Users className="h-4 w-4" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Conversion Rate"
            value={analyticsData?.conversion_points ? `${Object.keys(analyticsData.conversion_points).length}%` : '0%'}
            icon={<TrendingUp className="h-4 w-4" />}
            isLoading={isLoading}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            {/* Add a chart component here */}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
