
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormData {
  title: string;
  description: string;
  source_url: string;
  api_key: string;
}

// Using a demo developer ID for simplified deployment
const DEMO_USER_ID = "d394384a-8eb4-4f49-8cce-ba2d0784e3b4";

export const ExternalSourceDeployment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      source_url: "",
      api_key: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setDeploymentStatus("processing");
    setErrorMessage(null);
    
    try {
      // Create the agent with our demo user ID
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert({
          title: data.title,
          description: data.description,
          status: 'live',
          deployment_status: 'active',
          price: 0,
          developer_id: DEMO_USER_ID,
          api_endpoint: data.source_url,
          api_key: data.api_key
        })
        .select('id')
        .single();
      
      if (agentError) throw agentError;
      
      if (!agent?.id) {
        throw new Error("Failed to create agent");
      }
      
      // Initialize metrics for the agent so it appears in marketplace
      await supabase.from('agent_metrics')
        .insert({
          agent_id: agent.id,
          views: 0,
          unique_views: 0,
          purchases: 0,
          revenue: 0,
          date: new Date().toISOString().split('T')[0]
        });
      
      setDeploymentStatus("success");
      
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
              <AlertTitle>Deployment Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
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
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate('/developer/agents')}
            disabled={isSubmitting || deploymentStatus === "processing"}
          >
            Cancel
          </Button>
          
          {deploymentStatus === "idle" && (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Deploy Agent
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExternalSourceDeployment;
