
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Activity, AlertCircle, Server, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const APIMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['api-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="API Response Time"
        value={`${metrics?.response_time || 0}ms`}
        icon={<Server className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Error Rate"
        value={`${(metrics?.error_rate || 0).toFixed(2)}%`}
        icon={<AlertCircle className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Success Rate"
        value={`${(100 - (metrics?.error_rate || 0)).toFixed(2)}%`}
        icon={<Activity className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Requests/min"
        value={metrics?.requests_per_minute || '0'}
        icon={<TrendingUp className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  );
};
