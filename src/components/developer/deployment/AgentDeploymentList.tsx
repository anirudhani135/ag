
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Check, Server, Settings, Terminal } from "lucide-react";
import { AgentDeploymentDetails } from "./AgentDeploymentDetails";
import { DeploymentLogs } from "./DeploymentLogs";
import { subscribeToHealthUpdates } from "@/lib/realtimeSubscriptions";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface AgentDeploymentListProps {
  agents: any[];
  isLoading: boolean;
}

export const AgentDeploymentList = ({ agents, isLoading }: AgentDeploymentListProps) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState<string | null>(null);
  const [realtimeHealth, setRealtimeHealth] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!agents?.length) return;

    const channel = subscribeToHealthUpdates((payload) => {
      if (payload.new) {
        setRealtimeHealth(current => ({
          ...current,
          [payload.new.agent_id]: payload.new
        }));
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agents]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!agents?.length) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium">No agents deployed</h3>
        <p className="text-muted-foreground mt-2">
          Create and deploy your first agent to get started
        </p>
      </Card>
    );
  }

  const getHealthStatus = (agent: any) => {
    const deployment = agent.deployments?.[0];
    const realtime = realtimeHealth[agent.id];
    
    if (!deployment && !realtime) return "unknown";
    
    const status = realtime?.health_status || deployment?.health_status;
    return status || "unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "unhealthy":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {agents.map((agent) => {
        const healthStatus = getHealthStatus(agent);
        const deployment = agent.deployments?.[0];
        const lastCheck = deployment?.last_health_check;

        return (
          <Card key={agent.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{agent.title}</h3>
                  <Badge variant={agent.status === "live" ? "default" : "secondary"}>
                    {agent.status}
                  </Badge>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    getStatusColor(healthStatus)
                  )} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {agent.description}
                </p>
                {lastCheck && (
                  <p className="text-xs text-muted-foreground">
                    Last checked: {formatDistanceToNow(new Date(lastCheck), { addSuffix: true })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogs(showLogs === agent.id ? null : agent.id)}
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Logs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {showLogs === agent.id && (
              <DeploymentLogs
                agentId={agent.id}
                className="mt-4"
              />
            )}

            {selectedAgent === agent.id && (
              <AgentDeploymentDetails
                agent={agent}
                className="mt-4"
              />
            )}
          </Card>
        );
      })}
    </div>
  );
};
