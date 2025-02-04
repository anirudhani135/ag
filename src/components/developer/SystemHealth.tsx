import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "@/integrations/supabase/types";

type DeploymentRow = Database['public']['Tables']['deployments']['Row'];

interface DeploymentMetrics {
  responseTime: number;
  // Add other metric fields as needed
}

interface Deployment {
  health_status: string;
  metrics: DeploymentMetrics;
}

export const SystemHealth = () => {
  const { data: healthData } = useQuery({
    queryKey: ['developer', 'system-health'],
    queryFn: async () => {
      console.log('Fetching system health...');
      const { data: deployments, error } = await supabase
        .from('deployments')
        .select('health_status, metrics')
        .order('deployed_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching health status:', error);
        throw error;
      }

      // Transform the data to ensure it matches our expected type
      return (deployments as DeploymentRow[]).map(deployment => ({
        health_status: deployment.health_status || 'unknown',
        metrics: deployment.metrics as DeploymentMetrics
      }));
    }
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">System Health</h3>
        <Activity className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {healthData?.map((deployment, index) => (
          <Alert key={index} variant={deployment.health_status === 'healthy' ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Deployment Status</AlertTitle>
            <AlertDescription>
              Health Status: {deployment.health_status}
              {deployment.metrics && (
                <div className="mt-2 text-sm">
                  Response Time: {deployment.metrics.responseTime}ms
                </div>
              )}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </Card>
  );
};