
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DeploymentStatusProps {
  agentId: string;
  deploymentId?: string;
  onDeploymentComplete?: (success: boolean) => void;
}

export const DeploymentStatus = ({ 
  agentId, 
  deploymentId,
  onDeploymentComplete 
}: DeploymentStatusProps) => {
  const [status, setStatus] = useState<"pending" | "deploying" | "active" | "failed">("pending");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(true);

  // Mock deployment process for demonstration
  useEffect(() => {
    if (!deploymentId) return;
    
    const progressSteps = [10, 25, 40, 60, 75, 90, 100];
    let currentStep = 0;
    
    // Simulate deployment progress
    const interval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep]);
        
        // Add log message based on progress
        const logMessages = [
          "Initializing deployment environment...",
          "Setting up runtime configuration...",
          "Connecting to agent service...",
          "Configuring API endpoints...",
          "Running deployment tests...",
          "Finalizing deployment...",
          "Deployment complete!"
        ];
        
        setLogs(prev => [...prev, logMessages[currentStep]]);
        currentStep++;
        
        if (currentStep === 1) {
          setStatus("deploying");
        }
        
        if (currentStep === progressSteps.length) {
          setStatus("active");
          clearInterval(interval);
          setIsPolling(false);
          
          // Notify parent component of successful deployment
          if (onDeploymentComplete) {
            onDeploymentComplete(true);
          }
          
          toast.success("Agent deployed successfully!", {
            description: "Your agent is now ready to use."
          });
        }
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, [deploymentId, onDeploymentComplete]);
  
  // Poll for deployment status from real database in production
  useEffect(() => {
    if (!deploymentId || !isPolling) return;
    
    const checkDeploymentStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('deployments')
          .select('status, logs')
          .eq('id', deploymentId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Update status based on database
          if (data.status === 'active' || data.status === 'failed') {
            setIsPolling(false);
            setStatus(data.status as any);
            
            if (data.status === 'active' && onDeploymentComplete) {
              onDeploymentComplete(true);
            }
            
            if (data.status === 'failed' && onDeploymentComplete) {
              onDeploymentComplete(false);
            }
          }
          
          // Update logs if available
          if (data.logs && Array.isArray(data.logs)) {
            setLogs(data.logs);
          }
        }
      } catch (error) {
        console.error("Error checking deployment status:", error);
      }
    };
    
    const interval = setInterval(checkDeploymentStatus, 3000);
    return () => clearInterval(interval);
  }, [deploymentId, isPolling, onDeploymentComplete]);

  const renderStatusBadge = () => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "deploying":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 flex items-center gap-1 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            Deploying
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Deployment Status</CardTitle>
          {renderStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Deployment Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Deployment Logs</h4>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-2 max-h-40 overflow-y-auto">
            {logs.length > 0 ? (
              <ul className="space-y-1 text-xs font-mono">
                {logs.map((log, index) => (
                  <li key={index} className="pb-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="text-gray-500">[{new Date().toISOString().slice(11, 19)}]</span> {log}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 italic">No logs available yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
