
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertCircle, Server, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { subscribeToHealthUpdates } from "@/lib/realtimeSubscriptions";
import { Progress } from "@/components/ui/progress";

type DeploymentRow = Database['public']['Tables']['deployments']['Row'];

interface DeploymentMetrics {
  responseTime: number;
  errorRate: number;
  uptimePercentage: number;
  resourceUsage: {
    cpu: number;
    memory: number;
  };
}

const isValidMetrics = (metrics: any): metrics is DeploymentMetrics => {
  return typeof metrics === 'object' && 
         metrics !== null && 
         typeof metrics.responseTime === 'number' &&
         typeof metrics.errorRate === 'number' &&
         typeof metrics.uptimePercentage === 'number';
};

const getAlertVariant = (status: string) => {
  switch (status) {
    case 'critical':
      return 'destructive';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

export const SystemHealth = () => {
  const [realtimeData, setRealtimeData] = useState<DeploymentRow[]>([]);

  const { data: healthData, isLoading } = useQuery({
    queryKey: ['developer', 'system-health'],
    queryFn: async () => {
      console.log('Fetching system health...');
      const { data: deployments, error } = await supabase
        .from('deployments')
        .select('*, health_incidents(*)')
        .order('last_health_check', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching health status:', error);
        throw error;
      }

      return deployments as DeploymentRow[];
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
          {displayData.map((deployment) => (
            <Alert 
              key={deployment.id} 
              variant={getAlertVariant(deployment.alert_status || 'normal')}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                Deployment Status
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  deployment.health_status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {deployment.health_status}
                </span>
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Response Time: {deployment.response_time}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>Error Rate: {deployment.error_rate}%</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span>{deployment.uptime_percentage}%</span>
                    </div>
                    <Progress value={deployment.uptime_percentage} />
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
