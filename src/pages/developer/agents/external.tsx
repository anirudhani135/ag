
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { ErrorHandler } from "@/components/shared/ErrorHandler";
import { ErrorCategory } from "@/utils/errorHandling";

interface FormData {
  title: string;
  description: string;
  api_endpoint: string;
  api_key: string;
}

const ExternalSourceDeploymentPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorDetails, setErrorDetails] = useState<{ message: string; category: ErrorCategory } | null>(null);
  const [deployedAgentId, setDeployedAgentId] = useState<string | null>(null);
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
    setErrorDetails(null);
    
    try {
      // Validate the API endpoint format
      let endpoint = data.api_endpoint.trim();
      if (!endpoint.startsWith('http')) {
        endpoint = `https://${endpoint}`;
      }
      
      // Basic URL validation
      try {
        new URL(endpoint);
      } catch (e) {
        toast.error("Invalid API endpoint URL format");
        setErrorDetails({
          message: "Please enter a valid URL for the API endpoint",
          category: ErrorCategory.Validation
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Deploying external agent:", { title: data.title, endpoint });
      
      // Call the deploy-external-agent function
      const { data: result, error } = await supabase.functions.invoke('deploy-external-agent', {
        body: { 
          agentId: null, // Will be created in the function
          apiEndpoint: endpoint,
          apiKey: data.api_key.trim(),
          title: data.title.trim(),
          description: data.description.trim()
        }
      });
      
      if (error) {
        console.error("Function invocation error:", error);
        throw error;
      }
      
      if (!result || result.error) {
        console.error("Deployment returned error:", result?.error);
        throw new Error(result?.details || "Failed to deploy agent");
      }
      
      setDeploymentStatus("success");
      setDeployedAgentId(result.agentId);
      
      toast.success("Agent deployed successfully!", {
        description: "Your agent is now available in the marketplace."
      });
      
      // Redirect after successful deployment with a short delay
      setTimeout(() => {
        navigate(`/developer/agents`);
      }, 2000);
      
    } catch (error: any) {
      console.error("Deployment error:", error);
      setDeploymentStatus("error");
      
      let errorMessage = "There was an error deploying your agent";
      let category = ErrorCategory.ServerError;
      
      // Try to extract more specific error details
      if (error.message && error.message.includes("Edge Function returned a non-2xx status code")) {
        errorMessage = "The deployment service returned an error. This might be due to invalid input or a service issue.";
      } else if (error.message && error.message.includes("Failed to fetch")) {
        errorMessage = "Could not connect to the deployment service. Please check your internet connection and try again.";
        category = ErrorCategory.Network;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.details) {
        errorMessage = error.details;
      }
      
      setErrorDetails({
        message: errorMessage,
        category
      });
      
      toast.error("Deployment failed", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestAgent = () => {
    if (deployedAgentId) {
      navigate(`/marketplace?agentId=${deployedAgentId}`);
    }
  };

  const handleRetry = () => {
    setDeploymentStatus("idle");
    setErrorDetails(null);
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-8 pt-16 pb-16 bg-background">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Deploy External AI Agent</h1>
          <p className="text-muted-foreground mt-2">
            Connect your external AI agent to the platform marketplace
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Deploy External Agent
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {errorDetails && (
                <ErrorHandler 
                  error={new Error(errorDetails.message)}
                  category={errorDetails.category}
                  resetError={handleRetry}
                  retry={handleRetry}
                />
              )}
              
              {deploymentStatus === "success" && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Deployment Successful</AlertTitle>
                  <AlertDescription>
                    Your agent has been successfully deployed and is now available in the marketplace.
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleTestAgent} 
                        className="text-green-700 bg-green-100 hover:bg-green-200 border-green-300"
                      >
                        Test Your Agent
                      </Button>
                    </div>
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
                  <Textarea 
                    id="description" 
                    {...register("description", { required: "Description is required" })}
                    disabled={isSubmitting || deploymentStatus === "success"}
                    placeholder="Describe what your agent does and how it can help users"
                    className="min-h-[100px]"
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
                  <p className="text-xs text-muted-foreground">
                    Your API should accept POST requests with a JSON body containing a "message" field
                  </p>
                  {errors.api_endpoint && (
                    <p className="text-sm text-red-500 mt-1">{errors.api_endpoint.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key (Optional)</Label>
                  <Input 
                    id="api_key" 
                    type="password"
                    {...register("api_key")}
                    disabled={isSubmitting || deploymentStatus === "success"}
                  />
                  <p className="text-xs text-muted-foreground">
                    If your API requires authentication, provide your API key here
                  </p>
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
      </div>
    </DashboardLayout>
  );
};

export default ExternalSourceDeploymentPage;
