
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Server, Shield, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Badge } from '@/components/ui/badge';

export const DeploymentMonitoring = () => {
  const { data: deployments, isLoading } = useQuery({
    queryKey: ['deployment-monitoring'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('deployments')
        .select(`
          id,
          agent_id,
          status,
          health_status,
          error_rate,
          response_time,
          uptime_percentage,
          last_health_check,
          agents(title)
        `)
        .eq('agents.developer_id', user.id)
        .order('last_health_check', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      return data || [];
    },
    staleTime: 30 * 1000, // 30 seconds cache
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <span>Deployment Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !deployments || deployments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No active deployments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="p-3 bg-muted/30 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">{deployment.agents?.title || 'Unnamed Agent'}</div>
                  <Badge 
                    className={`
                      ${deployment.health_status === 'healthy' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                      ${deployment.health_status === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                      ${deployment.health_status === 'unhealthy' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                      ${!deployment.health_status ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
                    `}
                  >
                    {deployment.health_status || 'unknown'}
                  </Badge>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-muted-foreground" />
                      <span>Uptime</span>
                    </div>
                    <span>{deployment.uptime_percentage?.toFixed(2) || 0}%</span>
                  </div>
                  <Progress 
                    value={deployment.uptime_percentage || 0} 
                    className="h-1.5"
                    indicatorClassName={`
                      ${deployment.uptime_percentage >= 99 ? 'bg-green-500' : ''} 
                      ${deployment.uptime_percentage < 99 && deployment.uptime_percentage >= 95 ? 'bg-yellow-500' : ''}
                      ${deployment.uptime_percentage < 95 ? 'bg-red-500' : ''}
                    `}
                  />
                </div>
                
                <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Error rate: {deployment.error_rate?.toFixed(2) || 0}%</span>
                  </div>
                  <div>
                    {deployment.last_health_check && 
                      formatDistanceToNow(new Date(deployment.last_health_check), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
