
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertCircle, Server, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { subscribeToHealthUpdates } from "@/lib/realtimeSubscriptions";
import { Progress } from "@/components/ui/progress";

type SystemMetrics = Database['public']['Tables']['system_performance_metrics']['Row'];

const getAlertVariant = (status: string | null): "default" | "destructive" => {
  switch (status) {
    case 'critical':
      return 'destructive';
    case 'warning':
      return 'destructive';
    default:
      return 'default';
  }
};

export const SystemHealth = () => {
  const [realtimeData, setRealtimeData] = useState<SystemMetrics[]>([]);

  const { data: healthData, isLoading } = useQuery({
    queryKey: ['developer', 'system-health'],
    queryFn: async () => {
      console.log('Fetching system health...');
      const { data: metrics, error } = await supabase
        .from('system_performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching health status:', error);
        throw error;
      }

      return metrics;
    }
  });

  useEffect(() => {
    const channel = subscribeToHealthUpdates((payload) => {
      setRealtimeData(current => {
        const updated = [...(current.length ? current : healthData || [])];
        const index = updated.findIndex(d => d.id === payload.new.id);
        if (index !== -1) {
          updated[index] = payload.new;
        } else {
          updated.unshift(payload.new);
          updated.splice(5); // Keep only 5 items
        }
        return updated;
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [healthData]);

  const displayData = realtimeData.length ? realtimeData : healthData || [];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">System Health</h3>
        <Activity className="w-5 h-5 text-muted-foreground" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {displayData.map((metric) => (
            <Alert 
              key={metric.id} 
              variant={getAlertVariant(metric.alert_status)}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {metric.service_name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  metric.error_rate < 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.error_rate < 1 ? 'Healthy' : 'Issues Detected'}
                </span>
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Response Time: {metric.response_time}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>Error Rate: {metric.error_rate}%</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span>{metric.uptime_percentage}%</span>
                    </div>
                    <Progress value={metric.uptime_percentage} />
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </Card>
  );
};
