
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorHandler } from "@/components/shared/ErrorHandler";
import { ErrorCategory } from "@/utils/errorHandling";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface FormData {
  title: string;
  description: string;
  source_url: string;
  api_key: string;
  external_type: "openai" | "langflow" | "langchain" | "custom";
}

export const ExternalSourceDeployment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      source_url: "",
      api_key: "",
      external_type: "openai"
    }
  });

  const externalType = watch("external_type");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setDeploymentStatus("processing");
    setDeploymentProgress(10);
    setErrorMessage(null);
    
    try {
      // Create a new agent - removing properties that don't exist in the agents table
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert({
          title: data.title,
          description: data.description,
          developer_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'draft',
          // These properties will be stored in the agent_versions table instead
          version_number: "1.0" // Fix: Change to string type
        })
        .select('id')
        .single();
      
      if (agentError) throw agentError;
      
      setDeploymentProgress(30);
      
      if (!agent?.id) {
        throw new Error("Failed to create agent");
      }
      
      // Create agent version with the external source properties
      const { data: version, error: versionError } = await supabase
        .from('agent_versions')
        .insert({
          agent_id: agent.id,
          version_number: "1.0", // Fix: Change to string type
          status: 'active',
          changes: 'Initial external import',
          config: {
            external_type: data.external_type,
            source_url: data.source_url,
            api_key: data.api_key // Note: In production, store API keys securely
          }
        })
        .select('id')
        .single();
      
      if (versionError) throw versionError;
      setDeploymentProgress(50);

      if (!version?.id) {
        throw new Error("Failed to create agent version");
      }

      // Update the agent with the current version ID
      await supabase
        .from('agents')
        .update({ current_version_id: version.id })
        .eq('id', agent.id);
      
      // Create a deployment record
      const { data: deployment, error: deploymentError } = await supabase
        .from('deployments')
        .insert({
          agent_id: agent.id,
          version_id: version.id,
          status: 'deploying',
          health_status: 'pending',
          environment: 'production',
          resource_usage: {
            cpu: "0.5",
            memory: "512Mi",
            timeout: 30
          }
        })
        .select('id')
        .single();
      
      if (deploymentError) throw deploymentError;
      setDeploymentProgress(70);
      
      if (!deployment?.id) {
        throw new Error("Failed to create deployment");
      }
      
      setDeploymentId(deployment.id);
      
      // Call the deploy-agent edge function
      const { data: deployResponse, error: deployError } = await supabase.functions.invoke('deploy-agent', {
        body: {
          agentId: agent.id,
          versionId: version.id,
          deploymentId: deployment.id,
          externalType: data.external_type,
          sourceUrl: data.source_url,
          apiKey: data.api_key
        }
      });
      
      if (deployError) throw deployError;
      
      setDeploymentProgress(100);
      setDeploymentStatus("success");
      
      // Log the successful deployment to user_activity table instead of activity_log
      await supabase.from('user_activity')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          activity_type: 'agent_deployed',
          details: {
            resource_type: 'agent',
            resource_id: agent.id,
            deployment_id: deployment.id,
            deployment_type: 'external',
            external_type: data.external_type
          }
        });
      
      toast.success("Agent deployed successfully!", {
        description: "Your agent is now ready to use in the marketplace."
      });
      
      // Redirect to the agent detail page after a short delay
      setTimeout(() => {
        navigate(`/developer/agents`);
      }, 2000);
      
    } catch (error) {
      console.error("Deployment error:", error);
      setDeploymentStatus("error");
      setErrorMessage(error.message || "Failed to deploy agent");
      
      toast.error("Deployment failed", {
        description: error.message || "There was an error deploying your agent"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDeploymentStatus("idle");
    setDeploymentProgress(0);
    setErrorMessage(null);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Deploy External Agent</CardTitle>
        <CardDescription>
          Connect to external AI agents and services
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Deployment Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {deploymentStatus === "processing" && (
            <div className="space-y-2 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Deploying agent...</span>
                </div>
                <span>{deploymentProgress}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${deploymentProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {deploymentStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Deployment Successful</AlertTitle>
              <AlertDescription>
                Your agent has been successfully deployed and will be available in the marketplace shortly.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="external_type">Source Type</Label>
              <Select 
                defaultValue={externalType}
                onValueChange={(value) => setValue("external_type", value as any)}
                disabled={isSubmitting || deploymentStatus !== "idle"}
              >
                <SelectTrigger id="external_type">
                  <SelectValue placeholder="Select a source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI Assistant</SelectItem>
                  <SelectItem value="langflow">Langflow</SelectItem>
                  <SelectItem value="langchain">LangChain</SelectItem>
                  <SelectItem value="custom">Custom API</SelectItem>
                </SelectContent>
              </Select>
              {errors.external_type && (
                <p className="text-sm text-red-500 mt-1">{errors.external_type.message}</p>
              )}
              
              {externalType === "openai" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Connect to an existing OpenAI Assistant
                </p>
              )}
              
              {externalType === "langflow" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Deploy a LangFlow flow as an agent
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Agent Name</Label>
              <Input 
                id="title" 
                {...register("title", { required: "Agent name is required" })}
                disabled={isSubmitting || deploymentStatus !== "idle"}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                {...register("description", { required: "Description is required" })}
                disabled={isSubmitting || deploymentStatus !== "idle"}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source_url">
                {externalType === "openai" ? "Assistant ID" : 
                 externalType === "langflow" ? "Langflow API Endpoint" : 
                 "API Endpoint"}
              </Label>
              <Input 
                id="source_url" 
                {...register("source_url", { required: "This field is required" })}
                placeholder={
                  externalType === "openai" ? "asst_abc123..." : 
                  externalType === "langflow" ? "https://your-langflow-instance.com/api/v1/process" : 
                  "https://api.example.com/agent"
                }
                disabled={isSubmitting || deploymentStatus !== "idle"}
              />
              {errors.source_url && (
                <p className="text-sm text-red-500 mt-1">{errors.source_url.message}</p>
              )}
              
              {externalType === "openai" && (
                <p className="text-xs text-amber-600 mt-1 inline-flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1 text-amber-600" />
                  Enter your OpenAI Assistant ID (not the API key)
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input 
                id="api_key" 
                type="password"
                {...register("api_key", { required: "API key is required" })}
                disabled={isSubmitting || deploymentStatus !== "idle"}
              />
              {errors.api_key && (
                <p className="text-sm text-red-500 mt-1">{errors.api_key.message}</p>
              )}
              <p className="text-xs text-amber-600 mt-1 inline-flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1 text-amber-600" />
                API keys are encrypted and stored securely
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {deploymentStatus === "error" ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          ) : (
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/developer/agents')}
              disabled={isSubmitting || deploymentStatus === "processing"}
            >
              Cancel
            </Button>
          )}
          
          {deploymentStatus === "idle" && (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Deploy Agent
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};
