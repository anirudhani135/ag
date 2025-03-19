
import { useState, useEffect, useCallback, memo, useMemo } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface AgentDeploymentListProps {
  agents: any[];
  isLoading: boolean;
}

// Agent card as a separate optimized component
const AgentCard = memo(({ 
  agent, 
  healthStatus, 
  lastCheck, 
  selectedAgent, 
  showLogs, 
  onToggleLogs, 
  onToggleDetails 
}: any) => {
  // Memoize status color to prevent recalculation
  const statusColor = useMemo(() => {
    switch (healthStatus) {
      case "healthy":
        return "bg-green-500";
      case "unhealthy":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  }, [healthStatus]);

  // Memoize formatted time
  const formattedTime = useMemo(() => {
    return lastCheck ? formatDistanceToNow(new Date(lastCheck), { addSuffix: true }) : null;
  }, [lastCheck]);

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
              statusColor
            )} />
          </div>
          <p className="text-sm text-muted-foreground">
            {agent.description}
          </p>
          {formattedTime && (
            <p className="text-xs text-muted-foreground">
              Last checked: {formattedTime}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleLogs(agent.id)}
          >
            <Terminal className="w-4 h-4 mr-2" />
            Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleDetails(agent.id)}
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
});

AgentCard.displayName = 'AgentCard';

// Main component
export const AgentDeploymentList = memo(({ agents, isLoading }: AgentDeploymentListProps) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState<string | null>(null);
  const [realtimeHealth, setRealtimeHealth] = useState<Record<string, any>>({});

  // Event handlers with useCallback to prevent recreation
  const handleToggleDetails = useCallback((agentId: string) => {
    setSelectedAgent(current => current === agentId ? null : agentId);
  }, []);

  const handleToggleLogs = useCallback((agentId: string) => {
    setShowLogs(current => current === agentId ? null : agentId);
  }, []);

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

  // Get health status with memoization
  const getHealthStatus = useCallback((agent: any) => {
    const deployment = agent.deployments?.[0];
    const realtime = realtimeHealth[agent.id];
    
    if (!deployment && !realtime) return "unknown";
    
    return realtime?.health_status || deployment?.health_status || "unknown";
  }, [realtimeHealth]);

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

  return (
    <div className="space-y-4">
      {agents.map((agent) => {
        const healthStatus = getHealthStatus(agent);
        const deployment = agent.deployments?.[0];
        const lastCheck = deployment?.last_health_check;

        return (
          <AgentCard
            key={agent.id}
            agent={agent}
            healthStatus={healthStatus}
            lastCheck={lastCheck}
            selectedAgent={selectedAgent}
            showLogs={showLogs}
            onToggleLogs={handleToggleLogs}
            onToggleDetails={handleToggleDetails}
          />
        );
      })}
    </div>
  );
});

AgentDeploymentList.displayName = 'AgentDeploymentList';
