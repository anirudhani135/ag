
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { BaseChart } from "@/components/shared/charts/BaseChart";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Activity, AlertCircle, Globe, Server } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const APIAnalyticsDashboard = () => {
  const { data: apiMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['api-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: performanceMetrics, isLoading: performanceLoading } = useQuery({
    queryKey: ['system-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const chartData = apiMetrics?.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    responseTime: metric.response_time,
    requests: 1
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="API Response Time"
          value={`${performanceMetrics?.response_time || 0}ms`}
          icon={<Server className="w-6 h-6" />}
          isLoading={performanceLoading}
        />
        <MetricCard
          title="Error Rate"
          value={`${(performanceMetrics?.error_rate || 0).toFixed(2)}%`}
          icon={<AlertCircle className="w-6 h-6" />}
          isLoading={performanceLoading}
        />
        <MetricCard
          title="Uptime"
          value={`${(performanceMetrics?.uptime_percentage || 0).toFixed(1)}%`}
          icon={<Activity className="w-6 h-6" />}
          isLoading={performanceLoading}
        />
        <MetricCard
          title="Active Regions"
          value="Global"
          icon={<Globe className="w-6 h-6" />}
          isLoading={performanceLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseChart
          title="API Response Times"
          subtitle="Last 100 requests"
          isLoading={metricsLoading}
        >
          <LineChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="responseTime" 
              stroke="#8884d8" 
              dot={false}
            />
          </LineChart>
        </BaseChart>

        <BaseChart
          title="Request Volume"
          subtitle="Requests per minute"
          isLoading={metricsLoading}
        >
          <LineChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="requests" 
              stroke="#82ca9d" 
              dot={false}
            />
          </LineChart>
        </BaseChart>
      </div>
    </div>
  );
};
