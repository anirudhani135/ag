
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormData {
  title: string;
  description: string;
  api_endpoint: string;
  api_key: string;
}

// Using a demo developer ID for simplified deployment
const DEMO_USER_ID = "d394384a-8eb4-4f49-8cce-ba2d0784e3b4";

export const ExternalSourceDeployment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      api_endpoint: "",
      api_key: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Call the deploy-external-agent function
      const { data: result, error } = await supabase.functions.invoke('deploy-external-agent', {
        body: { 
          agentId: null, // Will be created in the function
          apiEndpoint: data.api_endpoint,
          apiKey: data.api_key,
          title: data.title,
          description: data.description
        }
      });
      
      if (error) throw error;
      
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
              <CheckCircle2 className="h-4 w-4 text-green-600" />
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
                disabled={isSubmitting || deploymentStatus === "success"}
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
                disabled={isSubmitting || deploymentStatus === "success"}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api_endpoint">API Endpoint</Label>
              <Input 
                id="api_endpoint" 
                {...register("api_endpoint", { required: "API endpoint is required" })}
                placeholder="https://api.example.com/agent"
                disabled={isSubmitting || deploymentStatus === "success"}
              />
              {errors.api_endpoint && (
                <p className="text-sm text-red-500 mt-1">{errors.api_endpoint.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input 
                id="api_key" 
                type="password"
                {...register("api_key", { required: "API key is required" })}
                disabled={isSubmitting || deploymentStatus === "success"}
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || deploymentStatus === "success"}
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
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExternalSourceDeployment;
