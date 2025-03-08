
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Activity, AlertCircle, Server, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface APIMetricsData {
  response_time: number;
  error_rate: number;
  requests_per_minute: number;
  status_code: number;
}

export const APIMetrics = () => {
  // Track if this is first load to distinguish between no data and loading
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['api-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('response_time, error_rate, status_code, requests_per_minute')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // If no records are found, return default values
        return {
          response_time: 0,
          error_rate: 0,
          status_code: 200,
          requests_per_minute: 0
        } as APIMetricsData;
      }
      
      return {
        ...data,
        response_time: data.response_time || 0,
        error_rate: data.error_rate || 0,
        requests_per_minute: data.requests_per_minute || 0
      } as APIMetricsData;
    }
  });

  useEffect(() => {
    if (!isLoading) {
      setIsFirstLoad(false);
    }
  }, [isLoading]);

  const showEmptyState = !isLoading && !isFirstLoad && (!metrics || 
    (metrics.response_time === 0 && 
     metrics.error_rate === 0 && 
     metrics.requests_per_minute === 0));

  return (
    <div className="space-y-4">
      {showEmptyState && (
        <Card className="p-6 text-center bg-gray-50">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Server className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No API metrics available yet</h3>
            <p className="text-muted-foreground max-w-md">
              Deploy an agent and generate some traffic to start seeing API performance metrics.
            </p>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="API Response Time"
          value={`${metrics?.response_time || 0}ms`}
          icon={<Server className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Average time to process API requests"
          emptyState={showEmptyState}
        />
        <MetricCard
          title="Error Rate"
          value={`${(metrics?.error_rate || 0).toFixed(2)}%`}
          icon={<AlertCircle className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Percentage of requests resulting in errors"
          emptyState={showEmptyState}
        />
        <MetricCard
          title="Success Rate"
          value={`${(100 - (metrics?.error_rate || 0)).toFixed(2)}%`}
          icon={<Activity className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Percentage of successfully processed requests"
          emptyState={showEmptyState}
        />
        <MetricCard
          title="Requests/min"
          value={metrics?.requests_per_minute || '0'}
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Average number of requests per minute"
          emptyState={showEmptyState}
        />
      </div>
    </div>
  );
};
