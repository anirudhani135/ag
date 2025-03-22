
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertCircle, Server, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { toast } from "sonner";

interface DeploymentHealth {
  id: string;
  agent_name: string;
  uptime: number;
  response_time: number;
  error_rate: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
  last_checked: string;
}

export const DeploymentMonitoring = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: deployments, isLoading, refetch } = useQuery({
    queryKey: ['deployment-health'],
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
          uptime_percentage,
          response_time,
          error_rate,
          last_health_check,
          agents!inner(title)
        `)
        .eq('agents.developer_id', user.id)
        .order('last_health_check', { ascending: false });
      
      if (error) throw error;
      
      return data.map(dep => ({
        id: dep.id,
        agent_name: dep.agents?.title || 'Unnamed Agent',
        uptime: dep.uptime_percentage || 0,
        response_time: dep.response_time || 0,
        error_rate: dep.error_rate || 0,
        status: dep.health_status as 'healthy' | 'degraded' | 'unhealthy',
        last_checked: dep.last_health_check
      }));
    },
    staleTime: 60 * 1000 // 1 minute
  });
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Deployment health data refreshed");
    } catch (error) {
      toast.error("Failed to refresh deployment health data");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-amber-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return 'bg-green-500';
    if (uptime >= 95) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <span>Deployment Health</span>
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !deployments || deployments.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No active deployments found</p>
            <p className="text-xs text-muted-foreground">Deploy your first agent to monitor its health</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="border border-border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{deployment.agent_name}</div>
                  <StatusBadge status={deployment.status} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Uptime</div>
                    <div className="flex items-center gap-2">
                      <Progress value={deployment.uptime} className={`h-2 ${getUptimeColor(deployment.uptime)}`} />
                      <span className="text-sm font-medium">{deployment.uptime.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Response Time</div>
                    <div className="text-sm font-medium">{deployment.response_time}ms</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Error Rate</div>
                    <div className="text-sm font-medium">{deployment.error_rate.toFixed(2)}%</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span className={getStatusColor(deployment.status)}>
                      {deployment.status === 'healthy' ? 'Healthy' : 
                       deployment.status === 'degraded' ? 'Performance Degraded' : 'Unhealthy'}
                    </span>
                  </div>
                  <div>
                    Last checked: {format(new Date(deployment.last_checked), 'MMM d, h:mm a')}
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
