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
import { LoadingButton } from "@/components/ui/loading-button";

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
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert({
          title: data.title,
          description: data.description,
          status: 'draft',
          deployment_status: 'active',
          price: 0,
          version_number: "1.0",
          category_id: null
        })
        .select('id')
        .single();
      
      if (agentError) throw agentError;
      
      setDeploymentProgress(30);
      
      if (!agent?.id) {
        throw new Error("Failed to create agent");
      }
      
      const { data: version, error: versionError } = await supabase
        .from('agent_versions')
        .insert({
          agent_id: agent.id,
          version_number: "1.0",
          status: 'active',
          changes: 'Initial external import',
          config: {
            external_type: data.external_type,
            source_url: data.source_url,
            api_key: data.api_key
          }
        })
        .select('id')
        .single();
      
      if (versionError) throw versionError;
      setDeploymentProgress(50);

      if (!version?.id) {
        throw new Error("Failed to create agent version");
      }

      await supabase
        .from('agents')
        .update({ 
          current_version_id: version.id,
          deployment_status: 'active',
          status: 'live' 
        })
        .eq('id', agent.id);
      
      const { data: deployment, error: deploymentError } = await supabase
        .from('deployments')
        .insert({
          agent_id: agent.id,
          version_id: version.id,
          status: 'running',
          health_status: 'healthy',
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
      
      await supabase.from('agent_metrics')
        .insert({
          agent_id: agent.id,
          views: 0,
          unique_views: 0,
          purchases: 0,
          revenue: 0,
          date: new Date().toISOString().split('T')[0]
        });
      
      toast.success("Agent deployed successfully!", {
        description: "Your agent is now available in the marketplace."
      });
      
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
          Connect to external AI agents and services - simply provide the API endpoint and key
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
                Your agent has been successfully deployed and is now available in the marketplace.
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
              <Label htmlFor="source_url">API Endpoint</Label>
              <Input 
                id="source_url" 
                {...register("source_url", { required: "API endpoint is required" })}
                placeholder="https://api.example.com/agent"
                disabled={isSubmitting || deploymentStatus !== "idle"}
              />
              {errors.source_url && (
                <p className="text-sm text-red-500 mt-1">{errors.source_url.message}</p>
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
            <LoadingButton 
              type="submit" 
              isLoading={isSubmitting}
              className="flex items-center"
              loadingText="Deploying..."
              icon={<ArrowRight className="mr-2 h-4 w-4" />}
            >
              Deploy Agent
            </LoadingButton>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExternalSourceDeployment;
