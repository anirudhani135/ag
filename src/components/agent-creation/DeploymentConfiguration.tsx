
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Loader2, Server, Zap, Upload, Code, Bot } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DeploymentConfigProps {
  agentId: string;
  onDeploymentComplete: (deploymentId: string) => void;
}

export const DeploymentConfiguration = ({ agentId, onDeploymentComplete }: DeploymentConfigProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentType, setDeploymentType] = useState<"langflow" | "native">("langflow");
  const [environment, setEnvironment] = useState<"production" | "staging">("staging");
  const [langflowConfig, setLangflowConfig] = useState<string>("");
  const [resourceConfig, setResourceConfig] = useState({
    cpu: "0.5",
    memory: "512",
    timeout: 30,
    minReplicas: 1,
    maxReplicas: 3,
  });

  const handleProcessLangflow = async () => {
    if (!langflowConfig.trim()) {
      toast.error("Please provide a valid Langflow configuration");
      return;
    }

    setIsDeploying(true);
    try {
      let config;
      try {
        config = JSON.parse(langflowConfig);
      } catch (e) {
        toast.error("Invalid JSON configuration");
        setIsDeploying(false);
        return;
      }

      // Call the process-langflow edge function
      const { data, error } = await supabase.functions.invoke('process-langflow', {
        body: { agentId, config }
      });

      if (error) throw error;

      toast.success("Langflow configuration processed");
      
      // Start the deployment process
      await handleDeploy(data.versionId);
      
    } catch (error) {
      console.error("Error processing Langflow config:", error);
      toast.error("Failed to process configuration");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeploy = async (versionId: string) => {
    setIsDeploying(true);
    
    try {
      const deploymentConfig = {
        environment,
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

      toast.success("Agent deployment initiated");
      onDeploymentComplete(data.deploymentId);
      
    } catch (error) {
      console.error("Error deploying agent:", error);
      toast.error("Failed to deploy agent");
    } finally {
      setIsDeploying(false);
    }
  };

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
                  <Code className="h-4 w-4" />
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
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={deploymentType === "langflow" ? handleProcessLangflow : () => {}}
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
      </CardFooter>
    </Card>
  );
};
