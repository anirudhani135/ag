
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { BaseChart } from "@/components/shared/charts/BaseChart";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Users, Clock, TrendingUp, MousePointer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const UserEngagementMetrics = () => {
  const { data: engagementData, isLoading } = useQuery({
    queryKey: ['user-engagement'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_engagement_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(24);
      
      if (error) throw error;
      return data;
    }
  });

  const averageSessionDuration = engagementData?.reduce((acc, curr) => 
    acc + (curr.session_duration || 0), 0) / (engagementData?.length || 1);

  const chartData = engagementData?.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    duration: metric.session_duration,
    features: Object.keys(metric.features_used || {}).length
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value={engagementData?.length || 0}
          icon={<Users className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${Math.round(averageSessionDuration / 60)} mins`}
          icon={<Clock className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Feature Usage"
          value={chartData[0]?.features || 0}
          icon={<MousePointer className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Engagement Rate"
          value="78%"
          icon={<TrendingUp className="w-6 h-6" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseChart
          title="Session Duration Trends"
          subtitle="Average session duration over time"
          isLoading={isLoading}
        >
          <BarChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="duration" 
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </BaseChart>

        <BaseChart
          title="Feature Usage Distribution"
          subtitle="Number of features used per session"
          isLoading={isLoading}
        >
          <BarChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="features" 
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </BaseChart>
      </div>
    </div>
  );
};
