
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bot, 
  Star,
  Tag,
  Clock,
  BarChart2,
  MessageSquare,
  Settings,
  Zap,
  Download,
  Info,
  Edit,
  Loader2,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TestCaseForm } from "@/components/agent-creation/testing/TestCaseForm";
import { TestCase } from "@/types/agent-creation";
import { useToast } from "@/components/ui/use-toast";
import { AgentVersionControl } from "@/components/agent-creation/AgentVersionControl";

const AgentDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<any>(null);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoInput, setDemoInput] = useState("");
  const [demoOutput, setDemoOutput] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [processingDemo, setProcessingDemo] = useState(false);
  const [activeVersion, setActiveVersion] = useState("1.0.0");

  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // For demonstration, we're checking if a real agent exists first
        const { data, error } = await supabase
          .from('agents')
          .select(`
            id, 
            title, 
            description, 
            price, 
            category_id, 
            status, 
            rating, 
            reviews_count, 
            created_at, 
            updated_at, 
            version_number, 
            features, 
            test_results,
            deployment_status,
            technical_requirements,
            runtime_config
          `)
          .eq('id', id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching agent:", error);
          throw error;
        }
        
        if (data) {
          setAgent(data);
          if (data.test_results && Array.isArray(data.test_results)) {
            setTestCases(data.test_results);
          }
          if (data.version_number) {
            setActiveVersion(data.version_number);
          }
        } else {
          // If not found in database, use mock data
          setAgent({
            id,
            title: "AI Content Assistant",
            description: "A powerful AI assistant that helps generate and edit content for blogs, social media, and more. Supports multiple languages and formats.",
            price: 19.99,
            category_id: "1",
            status: "active",
            rating: 4.5,
            reviews_count: 27,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version_number: "1.0.0",
            features: ["Content Generation", "Multi-language Support", "Format Conversion"],
            deployment_status: "active",
            technical_requirements: {
              integration: {
                enableWebhook: true,
                webhookEvents: ["message.created", "message.updated"],
                authType: "bearer"
              }
            },
            runtime_config: {
              model: "gpt-4o",
              maxTokens: 4096,
              temperature: 0.7,
              systemPrompt: "You are a helpful AI assistant specialized in content creation."
            }
          });
          
          // Mock test cases
          setTestCases([
            {
              id: "1",
              name: "Content Generation Test",
              input: "Write a short paragraph about artificial intelligence",
              expectedOutput: "A paragraph about AI concepts and applications",
              status: "success"
            },
            {
              id: "2",
              name: "Translation Test",
              input: "Translate 'Hello world' to Spanish",
              expectedOutput: "Hola mundo",
              status: "success"
            }
          ]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error loading agent",
          description: "Could not load agent details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id, toast]);

  const handleTryDemo = () => {
    setIsDemoActive(true);
  };

  const handleSendMessage = async () => {
    if (!demoInput.trim()) return;
    
    setProcessingDemo(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDemoOutput(
        "This is a demo response from the AI agent. In a production environment, this would connect to the actual agent API endpoint and process your input:\n\n" +
        `"${demoInput}"\n\n` +
        "The agent would analyze your input and generate a response based on its training and configuration."
      );
    } catch (error) {
      console.error("Error in demo:", error);
      toast({
        title: "Demo error",
        description: "An error occurred while processing your request",
        variant: "destructive",
      });
    } finally {
      setProcessingDemo(false);
    }
  };

  const handleSaveTestCases = (updatedTestCases: TestCase[]) => {
    setTestCases(updatedTestCases);
    
    // In a real app, we'd save to the database here
    toast({
      title: "Test cases saved",
      description: `Saved ${updatedTestCases.length} test cases`,
    });
  };

  const handleVersionChange = (version: string) => {
    setActiveVersion(version);
    
    // In a real app, we'd load the specific version configuration here
    toast({
      title: "Version changed",
      description: `Switched to version ${version}`,
    });
  };

  if (loading) {
    return (
      <DashboardLayout type="developer">
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading agent details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!agent) {
    return (
      <DashboardLayout type="developer">
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Info className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Agent Not Found</h2>
            <p className="text-muted-foreground">The agent you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate("/developer/agents")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agent Management
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="developer">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/developer/agents")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{agent.title}</h1>
            <Badge 
              variant="outline" 
              className={`${
                agent.deployment_status === 'active' 
                  ? 'bg-green-50 text-green-700' 
                  : agent.deployment_status === 'pending' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'bg-gray-50 text-gray-700'
              }`}
            >
              {agent.deployment_status === 'active' ? 'Active' : 
               agent.deployment_status === 'pending' ? 'Pending' : 'Draft'}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/developer/agents/edit/${id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Agent
            </Button>
            
            <Button
              onClick={() => {
                toast({
                  title: "Agent published",
                  description: "Your agent is now available in the marketplace",
                });
              }}
            >
              <Zap className="mr-2 h-4 w-4" />
              Publish to Marketplace
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent details sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Agent Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="mt-1">{agent.description}</p>
                </div>
                
                <div className="pt-2 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Features</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {agent.features?.map((feature: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                    <p className="mt-1 font-medium">
                      {agent.price === 0 ? 'Free' : `$${agent.price.toFixed(2)}`}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Rating</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{agent.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-sm text-muted-foreground">
                        ({agent.reviews_count || 0} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
                    <p className="mt-1 font-mono text-sm">{activeVersion}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <p className="mt-1 text-sm">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Usage Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-muted-foreground">Total Calls</p>
                      <p className="text-lg font-semibold">1,248</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-muted-foreground">This Month</p>
                      <p className="text-lg font-semibold">256</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    navigate("/developer/analytics");
                    toast({
                      title: "Analytics",
                      description: "Viewing detailed analytics for this agent",
                    });
                  }}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  View Full Analytics
                </Button>
              </CardFooter>
            </Card>
            
            <AgentVersionControl 
              agentId={id || ""}
              currentVersion={activeVersion}
              onVersionChange={handleVersionChange}
            />
          </div>
          
          {/* Main agent view and tabs */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="demo" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="demo">Demo</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demo" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Try the Demo
                    </CardTitle>
                    <CardDescription>
                      Test your agent's functionality with sample inputs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isDemoActive ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Experience your agent in action</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                          Try out your agent's capabilities before publishing to the marketplace
                        </p>
                        <Button onClick={handleTryDemo}>
                          <Zap className="mr-2 h-4 w-4" />
                          Start Demo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-md border p-4 bg-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <p className="font-medium">Demo Assistant</p>
                          </div>
                          <p className="text-sm">
                            This is a demo environment. Messages sent here won't affect your production environment.
                          </p>
                        </div>
                        
                        {demoOutput && (
                          <div className="rounded-md border p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-5 w-5 text-primary" />
                              <p className="font-medium">Agent Response</p>
                            </div>
                            <p className="whitespace-pre-line">{demoOutput}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={demoInput}
                            onChange={(e) => setDemoInput(e.target.value)}
                            placeholder="Type your message here..."
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            onClick={handleSendMessage} 
                            disabled={!demoInput.trim() || processingDemo}
                          >
                            {processingDemo ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Send"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      Integration Guide
                    </CardTitle>
                    <CardDescription>
                      How to integrate this agent into your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">API Endpoint</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-2 py-1 bg-gray-100 rounded-md text-sm font-mono flex-1 overflow-x-auto">
                          https://api.example.com/agents/{id}/invoke
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://api.example.com/agents/${id}/invoke`);
                            toast({
                              title: "Copied to clipboard",
                              description: "API endpoint copied to clipboard",
                            });
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Example Request</h3>
                      <pre className="p-3 bg-gray-100 rounded-md text-sm font-mono mt-2 overflow-x-auto">
{`// API Request Example
fetch("https://api.example.com/agents/${id}/invoke", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    input: "Your input message here",
    config: {
      stream: false
    }
  })
})`}
                      </pre>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => {
                        window.open("https://docs.example.com/api", "_blank");
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Full API Documentation
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="configuration" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Agent Configuration
                    </CardTitle>
                    <CardDescription>
                      View and edit the agent's runtime configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Model Configuration</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-muted-foreground">Model</label>
                            <p className="font-medium">{agent.runtime_config?.model || 'gpt-4o'}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Max Tokens</label>
                            <p className="font-medium">{agent.runtime_config?.maxTokens || '4096'}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Temperature</label>
                            <p className="font-medium">{agent.runtime_config?.temperature || '0.7'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium">System Prompt</h3>
                        <div className="mt-2">
                          <pre className="p-3 bg-gray-100 rounded-md text-sm whitespace-pre-wrap">
                            {agent.runtime_config?.systemPrompt || 'You are a helpful assistant.'}
                          </pre>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium">API Integration Settings</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {agent.technical_requirements?.integration?.enableWebhook && (
                            <div className="col-span-1 sm:col-span-2">
                              <label className="text-xs text-muted-foreground">Webhook Enabled</label>
                              <div className="flex items-center mt-1">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                <p className="font-medium">Yes</p>
                              </div>
                            </div>
                          )}
                          
                          {agent.technical_requirements?.integration?.webhookEvents?.length > 0 && (
                            <div className="col-span-1 sm:col-span-2">
                              <label className="text-xs text-muted-foreground">Webhook Events</label>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {agent.technical_requirements.integration.webhookEvents.map((event: string, i: number) => (
                                  <Badge key={i} variant="outline">
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <label className="text-xs text-muted-foreground">Authentication Type</label>
                            <p className="font-medium capitalize">
                              {agent.technical_requirements?.integration?.authType || 'None'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => {
                        navigate(`/developer/agents/edit/${id}`);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Configuration
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="testing" className="space-y-4">
                <TestCaseForm 
                  testCases={testCases} 
                  onSave={handleSaveTestCases}
                  runningEnabled={agent.deployment_status === 'active'}
                />
              </TabsContent>
              
              <TabsContent value="monitoring" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>
                      Monitor your agent's performance and usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Response Time</h3>
                        <p className="text-2xl font-bold">245ms</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                          3% faster than last week
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
                        <p className="text-2xl font-bold">99.2%</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                          0.8% improvement
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Daily Requests</h3>
                        <p className="text-2xl font-bold">1,245</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                          12% increase
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Request Volume (Last 7 Days)</h3>
                      {/* Mock chart - in a real app we'd use recharts */}
                      <div className="h-48 bg-gray-50 rounded-md flex items-end justify-between p-4">
                        {[35, 42, 58, 63, 75, 82, 92].map((value, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div 
                              className="w-6 bg-blue-500 rounded-t-sm" 
                              style={{ height: `${value}%` }}
                            ></div>
                            <span className="text-xs">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-6">
                      <h3 className="text-sm font-medium mb-3">Recent Errors</h3>
                      <div className="rounded-md border divide-y">
                        <div className="p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-red-600">Rate limit exceeded</p>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Too many requests from IP 192.168.1.1</p>
                        </div>
                        <div className="p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-amber-600">Timeout error</p>
                            <span className="text-xs text-muted-foreground">Yesterday</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Request timed out after 30 seconds</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        navigate("/developer/analytics");
                      }}
                    >
                      <BarChart2 className="mr-2 h-4 w-4" />
                      View Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentDetailView;
