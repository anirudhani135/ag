
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface DeploymentLog {
  id: string;
  deployment_id: string;
  environment_id: string | null;
  logs: string | null;
  metadata: Json | null;
  created_at: string | null;
  status: string;
}

interface DeploymentLogsProps {
  agentId: string;
  className?: string;
}

export const DeploymentLogs = ({ agentId, className }: DeploymentLogsProps) => {
  const [logs, setLogs] = useState<DeploymentLog[]>([]);

  useEffect(() => {
    // Initial logs fetch
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('deployment_logs')
        .select('*')
        .eq('deployment_id', agentId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        setLogs(data as DeploymentLog[]);
      }
    };

    fetchLogs();

    // Subscribe to real-time log updates
    const channel = supabase
      .channel('deployment-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deployment_logs',
          filter: `deployment_id=eq.${agentId}`
        },
        (payload) => {
          const newLog = payload.new as DeploymentLog;
          setLogs(current => [newLog, ...current].slice(0, 100));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId]);

  const getLogLevelColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="text-sm font-mono p-2 rounded bg-muted/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className={cn(
                    "text-white",
                    getLogLevelColor(log.status)
                  )}
                >
                  {log.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {log.created_at && new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-xs">
                {log.logs || 'No log content'}
              </pre>
            </div>
          ))}
          {!logs.length && (
            <div className="text-center text-muted-foreground p-4">
              No logs available
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
