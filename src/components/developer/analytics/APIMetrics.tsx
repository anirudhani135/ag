import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Server, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricExplanationTooltip } from "./MetricExplanationTooltip";
import { Badge } from "@/components/ui/badge";

interface ApiMetric {
  endpoint: string;
  error_details: any;
  error_rate: number;
  id: string;
  ip_address: string;
  request_method: string;
  requests_count: number;
  requests_per_minute: number;
  response_time: number;
  status_code: number;
  timestamp: string;
  user_agent: string;
}

interface DisplayMetrics {
  success_rate: number;
  avg_response_time: number;
  throughput: number;
  error_rate: number;
}

export const APIMetrics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['api-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const metric = data[0] as ApiMetric;
        
        const displayMetrics: DisplayMetrics = {
          success_rate: 100 - metric.error_rate,
          avg_response_time: metric.response_time,
          throughput: metric.requests_per_minute * 60,
          error_rate: metric.error_rate
        };
        
        return displayMetrics;
      }
      
      return {
        success_rate: 98.7,
        avg_response_time: 245,
        throughput: 1250,
        error_rate: 1.3
      } as DisplayMetrics;
    },
  });

  const getStatusBadge = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return <Badge className="bg-green-500">Excellent</Badge>;
    if (value >= thresholds[0]) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  const getResponseTimeBadge = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return <Badge className="bg-green-500">Excellent</Badge>;
    if (value <= thresholds[1]) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">API Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">API Performance Metrics</CardTitle>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center">
              <MetricExplanationTooltip
                title="Success Rate"
                description="Percentage of API requests that complete successfully without errors."
                goodValue="Above 99%"
                warningThreshold="95-99%"
                criticalThreshold="Below 95%"
              >
                <span>Success Rate</span>
              </MetricExplanationTooltip>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{data?.success_rate}%</div>
              {getStatusBadge(data?.success_rate || 0, [95, 99])}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.success_rate >= 99 ? 'Excellent performance' : 
               data?.success_rate >= 95 ? 'Good performance' : 'Needs improvement'}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center">
              <MetricExplanationTooltip
                title="Average Response Time"
                description="The average time it takes for your API to respond to requests."
                goodValue="Below 200ms"
                warningThreshold="200-500ms"
                criticalThreshold="Above 500ms"
              >
                <span>Avg. Response Time</span>
              </MetricExplanationTooltip>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{data?.avg_response_time}ms</div>
              {getResponseTimeBadge(data?.avg_response_time || 0, [200, 500])}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.avg_response_time <= 200 ? 'Fast responses' : 
               data?.avg_response_time <= 500 ? 'Acceptable speed' : 'Too slow'}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center">
              <MetricExplanationTooltip
                title="API Throughput"
                description="Number of API requests processed per hour."
                goodValue="Depends on your service capacity"
              >
                <span>Throughput</span>
              </MetricExplanationTooltip>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{data?.throughput}/hr</div>
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.throughput > 1000 ? 'High volume' : 'Normal volume'}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center">
              <MetricExplanationTooltip
                title="Error Rate"
                description="Percentage of API requests that result in an error."
                goodValue="Below 1%"
                warningThreshold="1-5%"
                criticalThreshold="Above 5%"
              >
                <span>Error Rate</span>
              </MetricExplanationTooltip>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{data?.error_rate}%</div>
              {getStatusBadge(100 - (data?.error_rate || 0), [95, 99])}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.error_rate <= 1 ? 'Minimal errors' : 
               data?.error_rate <= 5 ? 'Some errors' : 'High error rate'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
