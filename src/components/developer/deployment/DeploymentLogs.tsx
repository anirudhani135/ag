
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface DeploymentLogsProps {
  agentId: string;
  className?: string;
}

export const DeploymentLogs = ({ agentId, className }: DeploymentLogsProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial logs fetch
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('deployment_logs')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        setLogs(data);
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
          filter: `agent_id=eq.${agentId}`
        },
        (payload) => {
          setLogs(current => [payload.new, ...current].slice(0, 100));
          if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
          }
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
      <ScrollArea className="h-[300px]" ref={scrollRef}>
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
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-xs">
                {log.logs}
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
