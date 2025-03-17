
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Loader2, Server, Zap, Bot, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

interface DeploymentConfigProps {
  agentId: string;
  onDeploymentComplete: (deploymentId: string) => void;
}

// Define proper types for the metrics and resource usage
interface DeploymentMetrics {
  progress?: number;
  error?: string;
  deployment_type?: string;
  current_stage?: string;
  last_update?: string;
  completion_time?: string;
  status?: string;
}

interface ResourceScaling {
  minReplicas?: number;
  maxReplicas?: number;
}

interface ResourceUsage {
  cpu?: string;
  memory?: string;
  timeout?: number;
  scaling?: ResourceScaling;
}

interface DeploymentData {
  id: string;
  agent_id: string;
  version_id: string;
  deployed_at: string;
  status: string;
  environment?: string;
  metrics: DeploymentMetrics | null;
  resource_usage: ResourceUsage | null;
  error_rate: number;
  response_time: number;
  health_status: string;
  incident_count: number;
  alert_status: string;
}

export const DeploymentConfiguration = ({ agentId, onDeploymentComplete }: DeploymentConfigProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentType, setDeploymentType] = useState<"langflow" | "native">("langflow");
  const [environment, setEnvironment] = useState<"production" | "staging">("staging");
  const [langflowConfig, setLangflowConfig] = useState<string>("");
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resourceConfig, setResourceConfig] = useState({
    cpu: "0.5",
    memory: "512",
    timeout: 30,
    minReplicas: 1,
    maxReplicas: 3,
  });

  // Fetch existing deployment if available
  const { data: existingDeployment, isLoading: isLoadingDeployment } = useQuery({
    queryKey: ['agent-deployment', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployments')
        .select('*')
        .eq('agent_id', agentId)
        .order('deployed_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as DeploymentData | null;
    },
    retry: 1
  });

  // Set up deployment progress tracking
  useEffect(() => {
    if (!deploymentId) return;
    
    const interval = setInterval(async () => {
      if (deploymentStatus === 'success' || deploymentStatus === 'error') {
        clearInterval(interval);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('deployments')
          .select('status, metrics')
          .eq('id', deploymentId)
          .single();

        if (error) throw error;

        if (data.status === 'running') {
          setDeploymentStatus('success');
          setDeploymentProgress(100);
          onDeploymentComplete(deploymentId);
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setDeploymentStatus('error');
          const errorMsg = typeof data.metrics === 'object' && data.metrics ? 
            (data.metrics as DeploymentMetrics).error || 'Deployment failed' : 
            'Deployment failed';
          setErrorMessage(errorMsg);
          clearInterval(interval);
        } else if (data.status === 'deploying') {
          // Update progress based on metrics
          const progress = typeof data.metrics === 'object' && data.metrics ? 
            (data.metrics as DeploymentMetrics).progress || deploymentProgress : 
            deploymentProgress;
          setDeploymentProgress(Math.min(95, Number(progress)));
        }
      } catch (error) {
        console.error("Error checking deployment status:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [deploymentId, deploymentStatus, onDeploymentComplete, deploymentProgress]);

  // Initialize from existing deployment if available
  useEffect(() => {
    if (existingDeployment) {
      // Safely access environment property
      if (existingDeployment.environment) {
        setEnvironment(existingDeployment.environment as "production" | "staging");
      }
      
      // Safely access metrics.deployment_type
      if (existingDeployment.metrics && typeof existingDeployment.metrics === 'object') {
        const metrics = existingDeployment.metrics as DeploymentMetrics;
        if (metrics.deployment_type) {
          setDeploymentType(metrics.deployment_type as "langflow" | "native");
        }
      }
      
      // Safely access resource_usage properties
      if (existingDeployment.resource_usage && typeof existingDeployment.resource_usage === 'object') {
        const resourceUsage = existingDeployment.resource_usage as ResourceUsage;
        
        setResourceConfig({
          cpu: resourceUsage.cpu || "0.5",
          memory: resourceUsage.memory || "512",
          timeout: resourceUsage.timeout || 30,
          minReplicas: resourceUsage.scaling?.minReplicas || 1,
          maxReplicas: resourceUsage.scaling?.maxReplicas || 3,
        });
      }
      
      if (existingDeployment.status === 'deploying') {
        setDeploymentId(existingDeployment.id);
        setDeploymentStatus('processing');
        
        // Safely get progress from metrics
        if (existingDeployment.metrics && typeof existingDeployment.metrics === 'object') {
          const metrics = existingDeployment.metrics as DeploymentMetrics;
          setDeploymentProgress(metrics.progress ? Number(metrics.progress) : 30);
        } else {
          setDeploymentProgress(30);
        }
      } else if (existingDeployment.status === 'running') {
        setDeploymentStatus('success');
        setDeploymentProgress(100);
      } else if (existingDeployment.status === 'failed') {
        setDeploymentStatus('error');
        
        // Safely get error from metrics
        if (existingDeployment.metrics && typeof existingDeployment.metrics === 'object') {
          const metrics = existingDeployment.metrics as DeploymentMetrics;
          setErrorMessage(metrics.error || 'Previous deployment failed');
        } else {
          setErrorMessage('Previous deployment failed');
        }
      }
    }
  }, [existingDeployment]);

  const handleProcessLangflow = async () => {
    if (!langflowConfig.trim()) {
      toast.error("Please provide a valid Langflow configuration");
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('processing');
    setDeploymentProgress(10);
    
    try {
      let config;
      try {
        config = JSON.parse(langflowConfig);
      } catch (e) {
        toast.error("Invalid JSON configuration");
        setIsDeploying(false);
        setDeploymentStatus('error');
        setErrorMessage("Invalid JSON configuration");
        return;
      }

      // Call the process-langflow edge function
      const { data, error } = await supabase.functions.invoke('process-langflow', {
        body: { agentId, config }
      });

      if (error) throw error;

      toast.success("Langflow configuration processed");
      setDeploymentProgress(40);
      
      // Start the deployment process
      await handleDeploy(data.versionId);
      
    } catch (error) {
      console.error("Error processing Langflow config:", error);
      toast.error("Failed to process configuration");
      setDeploymentStatus('error');
      setErrorMessage(error.message || "Failed to process configuration");
    } finally {
      if (deploymentStatus !== 'processing') {
        setIsDeploying(false);
      }
    }
  };

  const handleDeploy = async (versionId: string) => {
    setIsDeploying(true);
    setDeploymentStatus('processing');
    setDeploymentProgress(prev => Math.max(prev, 50));
    
    try {
      const deploymentConfig = {
        environment,
        deployment_type: deploymentType,
        resources: {
          cpu: resourceConfig.cpu,
          memory: resourceConfig.memory,
          timeout: resourceConfig.timeout
        },
        scaling: {
          minReplicas: resourceConfig.minReplicas,
          maxReplicas: resourceConfig.maxReplicas
        }
      };

      // Call the deploy-agent edge function
      const { data, error } = await supabase.functions.invoke('deploy-agent', {
        body: { agentId, versionId, config: deploymentConfig }
      });

      if (error) throw error;

      setDeploymentId(data.deploymentId);
      setDeploymentProgress(70);
      toast.success("Agent deployment initiated");
      
    } catch (error) {
      console.error("Error deploying agent:", error);
      toast.error("Failed to deploy agent");
      setDeploymentStatus('error');
      setErrorMessage(error.message || "Failed to deploy agent");
      setIsDeploying(false);
    }
  };

  const renderDeploymentStatus = () => {
    switch (deploymentStatus) {
      case 'processing':
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
                <span className="font-medium">Deploying your agent...</span>
              </div>
              <span className="text-sm text-muted-foreground">{deploymentProgress}%</span>
            </div>
            <Progress value={deploymentProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              This may take a few minutes. You'll be notified once it's complete.
            </p>
          </div>
        );
      case 'success':
        return (
          <div className="space-y-4 mt-4 p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              <span className="font-medium text-green-700">Deployment Successful</span>
            </div>
            <p className="text-sm text-green-600">
              Your agent has been successfully deployed and is now ready to use.
            </p>
            <Button 
              variant="outline" 
              className="bg-white hover:bg-green-50 border-green-200 text-green-700"
              onClick={() => onDeploymentComplete(deploymentId!)}
            >
              View Deployment Details
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="space-y-4 mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              <span className="font-medium text-red-700">Deployment Failed</span>
            </div>
            <p className="text-sm text-red-600">
              {errorMessage || "There was an error during deployment. Please try again."}
            </p>
            <Button 
              variant="outline" 
              className="bg-white hover:bg-red-50 border-red-200 text-red-700"
              onClick={() => {
                setDeploymentStatus('idle');
                setErrorMessage('');
              }}
            >
              Try Again
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoadingDeployment) {
    return (
      <Card className="w-full border shadow-md">
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Agent Deployment
        </CardTitle>
        <CardDescription>
          Configure and deploy your agent to make it available to users
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderDeploymentStatus()}
        
        {deploymentStatus === 'idle' && (
          <Tabs defaultValue="deployment-type" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="deployment-type">Deployment Type</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deployment-type" className="space-y-4">
              <RadioGroup 
                defaultValue={deploymentType} 
                onValueChange={(value) => setDeploymentType(value as "langflow" | "native")}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="langflow" id="langflow" />
                  <Label htmlFor="langflow" className="flex items-center gap-2 cursor-pointer">
                    <Bot className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Langflow Integration</p>
                      <p className="text-sm text-muted-foreground">Deploy using Langflow configuration</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="native" id="native" />
                  <Label htmlFor="native" className="flex items-center gap-2 cursor-pointer">
                    <Bot className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Native Deployment</p>
                      <p className="text-sm text-muted-foreground">Use our built-in deployment system</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              
              {deploymentType === "langflow" && (
                <div className="space-y-4 mt-4 p-4 border rounded-lg">
                  <Label htmlFor="langflow-config">Langflow Configuration JSON</Label>
                  <Textarea
                    id="langflow-config"
                    placeholder="Paste your Langflow JSON configuration here"
                    className="min-h-32 font-mono text-sm"
                    value={langflowConfig}
                    onChange={(e) => setLangflowConfig(e.target.value)}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={environment}
                    onValueChange={(value) => setEnvironment(value as "production" | "staging")}
                  >
                    <SelectTrigger id="environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU (cores)</Label>
                  <Select 
                    value={resourceConfig.cpu}
                    onValueChange={(value) => setResourceConfig({...resourceConfig, cpu: value})}
                  >
                    <SelectTrigger id="cpu">
                      <SelectValue placeholder="Select CPU allocation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.25">0.25 cores</SelectItem>
                      <SelectItem value="0.5">0.5 cores</SelectItem>
                      <SelectItem value="1.0">1.0 cores</SelectItem>
                      <SelectItem value="2.0">2.0 cores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="memory">Memory (MB)</Label>
                  <Select
                    value={resourceConfig.memory}
                    onValueChange={(value) => setResourceConfig({...resourceConfig, memory: value})}
                  >
                    <SelectTrigger id="memory">
                      <SelectValue placeholder="Select memory allocation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256">256 MB</SelectItem>
                      <SelectItem value="512">512 MB</SelectItem>
                      <SelectItem value="1024">1 GB</SelectItem>
                      <SelectItem value="2048">2 GB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="5"
                    max="300"
                    value={resourceConfig.timeout}
                    onChange={(e) => setResourceConfig({...resourceConfig, timeout: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label className="text-base">Scaling Configuration</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="min-replicas">Minimum Instances</Label>
                    <Input
                      id="min-replicas"
                      type="number"
                      min="1"
                      max="5"
                      value={resourceConfig.minReplicas}
                      onChange={(e) => setResourceConfig({...resourceConfig, minReplicas: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-replicas">Maximum Instances</Label>
                    <Input
                      id="max-replicas"
                      type="number"
                      min="1"
                      max="10"
                      value={resourceConfig.maxReplicas}
                      onChange={(e) => setResourceConfig({...resourceConfig, maxReplicas: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="metrics">Detailed Metrics Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Collect detailed performance and usage metrics
                    </p>
                  </div>
                  <Switch id="metrics" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="logging">Enhanced Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging for debugging
                    </p>
                  </div>
                  <Switch id="logging" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rate-limiting">Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit requests to prevent abuse
                    </p>
                  </div>
                  <Switch id="rate-limiting" defaultChecked />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {deploymentStatus === 'idle' && (
          <>
            <Button variant="outline">Cancel</Button>
            <Button 
              onClick={deploymentType === "langflow" ? handleProcessLangflow : () => handleDeploy("latest")}
              disabled={isDeploying || (deploymentType === "langflow" && !langflowConfig)}
              className="relative overflow-hidden"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Deploy Agent
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
