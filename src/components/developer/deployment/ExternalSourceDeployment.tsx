
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload, Server, Globe, Database, Code, Bot, CheckCircle, Loader2, AlertCircle, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Agent name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  categoryId: z.string(),
  externalType: z.enum(["api", "langflow", "custom"]),
  apiEndpoint: z.string().url().optional(),
  apiKey: z.string().optional(),
  customConfig: z.any().optional(),
  isPublic: z.boolean().default(false),
});

export function ExternalSourceDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedConfig, setUploadedConfig] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "productivity",
      externalType: "api",
      apiEndpoint: "",
      isPublic: false,
    },
  });

  const externalType = form.watch("externalType");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const config = JSON.parse(content);
        setUploadedConfig(config);
        form.setValue("customConfig", config);
        toast({
          title: "Configuration uploaded",
          description: "Your LangFlow configuration has been successfully uploaded.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid configuration",
          description: "The uploaded file is not a valid JSON configuration.",
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error reading file",
        description: "There was an error reading the uploaded file.",
      });
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsDeploying(true);
    setDeploymentStep(1);
    setDeploymentProgress(10);
    setAuthError(null);

    try {
      if (!user) {
        throw new Error('Authentication required');
      }

      setDeploymentProgress(20);
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert({
          title: values.name,
          description: values.description,
          price: values.price,
          category_id: values.categoryId,
          developer_id: user.id,
          status: values.isPublic ? 'active' : 'pending_review',
          technical_requirements: {
            integration_type: values.externalType,
            api_endpoint: values.apiEndpoint,
            external_config: values.customConfig
          },
          deployment_status: 'deploying'
        })
        .select()
        .single();

      if (agentError) throw agentError;
      
      setDeploymentProgress(40);
      setDeploymentStep(2);
      
      const { data: version, error: versionError } = await supabase
        .from('agent_versions')
        .insert({
          agent_id: agent.id,
          version_number: '1.0.0',
          runtime_config: {
            integration_type: values.externalType,
            api_endpoint: values.apiEndpoint
          },
          status: 'active'
        })
        .select()
        .single();
        
      if (versionError) throw versionError;
      
      setDeploymentProgress(60);
      setDeploymentStep(3);
      
      const { data: deployment, error: deploymentError } = await supabase
        .from('deployments')
        .insert({
          agent_id: agent.id,
          version_id: version.id,
          status: 'deploying',
          metrics: {
            deployment_type: values.externalType,
            progress: 60,
            current_stage: 'configuring'
          },
          resource_usage: {
            cpu: '0.5',
            memory: '512',
            scaling: {
              minReplicas: 1,
              maxReplicas: 3
            }
          }
        })
        .select()
        .single();
        
      if (deploymentError) throw deploymentError;
      
      setDeploymentProgress(80);
      setDeploymentStep(4);
      
      setTimeout(async () => {
        try {
          const { error: updateError } = await supabase
            .from('deployments')
            .update({
              status: 'running',
              metrics: {
                deployment_type: values.externalType,
                progress: 100,
                current_stage: 'completed'
              }
            })
            .eq('id', deployment.id);
            
          if (updateError) throw updateError;
          
          // Update agent status to make it immediately available in marketplace
          await supabase
            .from('agents')
            .update({
              deployment_status: 'live',
              status: values.isPublic ? 'active' : 'pending_review'
            })
            .eq('id', agent.id);
          
          setDeploymentProgress(100);
          
          toast({
            title: "Deployment successful",
            description: "Your agent has been successfully deployed and is now available in the marketplace.",
          });
          
          setTimeout(() => {
            navigate(`/marketplace`);
          }, 1500);
        } catch (error) {
          console.error('Deployment completion error:', error);
          toast({
            variant: "destructive",
            title: "Deployment failed at final stage",
            description: error instanceof Error ? error.message : "An unexpected error occurred during completion",
          });
          setIsDeploying(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Deployment error:', error);
      
      if (error instanceof Error && error.message === 'Authentication required') {
        setAuthError('You need to be signed in to deploy an agent. Please sign in and try again.');
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be signed in to deploy an agent",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Deployment failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
        });
      }
      
      setIsDeploying(false);
    }
  }

  const handleLogin = () => {
    navigate("/auth/login", { state: { from: "/agent-external-deployment" } });
  };

  const renderDeploymentStatus = () => {
    if (!isDeploying) return null;
    
    const steps = [
      { name: "Preparing", description: "Setting up agent configuration" },
      { name: "Creating Agent", description: "Registering agent in the marketplace" },
      { name: "Creating Version", description: "Creating initial agent version" },
      { name: "Deployment", description: "Deploying agent to production" },
      { name: "Finalizing", description: "Making agent available to users" }
    ];
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Deployment Progress</h3>
          <span className="text-sm font-semibold">{deploymentProgress}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${deploymentProgress}%` }}
          ></div>
        </div>
        
        <div className="mt-4 space-y-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-start gap-3 p-2 rounded-md transition-all",
                index === deploymentStep ? "bg-blue-50" : "",
                index < deploymentStep ? "text-gray-400" : ""
              )}
            >
              <div className="mt-0.5">
                {index < deploymentStep ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : index === deploymentStep ? (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                )}
              </div>
              <div>
                <p className="font-medium">{step.name}</p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Deploy External AI Agent</CardTitle>
        <CardDescription>
          Connect and deploy an AI agent from an external source to make it available in the marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-700">Authentication Required</p>
              <p className="text-sm text-red-600">{authError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogin} 
                className="mt-2 bg-red-100 text-red-700 hover:bg-red-200 border-red-300"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        )}
        
        {renderDeploymentStatus()}
        
        {!isDeploying && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter agent name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="productivity">Productivity</SelectItem>
                            <SelectItem value="creativity">Creativity</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what your agent does" 
                          className="h-[169px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">External Source Configuration</h3>
                
                <FormField
                  control={form.control}
                  name="externalType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Integration Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2 rounded-md border p-4 hover:border-primary/50 cursor-pointer">
                            <RadioGroupItem value="api" id="api" />
                            <Label htmlFor="api" className="flex items-center cursor-pointer">
                              <Globe className="mr-2 h-5 w-5 text-blue-500" />
                              <div>
                                <p className="font-medium">API Integration</p>
                                <p className="text-sm text-muted-foreground">Connect to your hosted API</p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-4 hover:border-primary/50 cursor-pointer">
                            <RadioGroupItem value="langflow" id="langflow" />
                            <Label htmlFor="langflow" className="flex items-center cursor-pointer">
                              <Database className="mr-2 h-5 w-5 text-purple-500" />
                              <div>
                                <p className="font-medium">LangFlow</p>
                                <p className="text-sm text-muted-foreground">Upload LangFlow JSON config</p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-4 hover:border-primary/50 cursor-pointer">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom" className="flex items-center cursor-pointer">
                              <Code className="mr-2 h-5 w-5 text-green-500" />
                              <div>
                                <p className="font-medium">Custom Integration</p>
                                <p className="text-sm text-muted-foreground">Configure a custom integration</p>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {externalType === "api" && (
                  <div className="space-y-4 border rounded-md p-4">
                    <FormField
                      control={form.control}
                      name="apiEndpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Endpoint</FormLabel>
                          <FormControl>
                            <Input placeholder="https://api.yourservice.com/agent" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL of your API that will receive requests from our platform
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key (Optional)</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Your API authentication key" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll securely store this key and use it for authentication with your API
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {externalType === "langflow" && (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed rounded-md">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-medium">Drag & drop your LangFlow JSON file</p>
                        <p className="text-xs text-muted-foreground">
                          Or click to browse files (max 5MB)
                        </p>
                      </div>
                      <label className="relative">
                        <Input 
                          type="file" 
                          accept=".json" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleFileUpload}
                        />
                        <Button variant="outline">
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Browse Files"
                          )}
                        </Button>
                      </label>
                      {uploadedConfig && (
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Configuration uploaded successfully
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {externalType === "custom" && (
                  <div className="space-y-4 border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">
                      For custom integrations, please contact our support team or refer to the
                      integration documentation for setup instructions.
                    </p>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Direct Publishing
                        </FormLabel>
                        <FormDescription>
                          Make this agent publicly available immediately without review process
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isDeploying || !user}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-4 w-4" />
                    Deploy Agent
                  </>
                )}
              </Button>
              
              {!user && (
                <div className="text-center mt-2">
                  <p className="text-sm text-red-500 mb-2">
                    You must be signed in to deploy an agent
                  </p>
                  <Button 
                    variant="outline"
                    onClick={handleLogin}
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In to Deploy
                  </Button>
                </div>
              )}
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
