
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "@/components/marketplace/ReviewForm";
import { BarChart, Activity, Code, PlayCircle, Settings, Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TestCase } from "@/types/agent-creation";

interface AgentData {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
  status: string;
  developer_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
  };
  developer?: {
    name: string;
    avatar_url: string;
  };
}

export const AgentDetailView = () => {
  const { agentId } = useParams();
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!agentId) return;

      try {
        // Fetch agent details
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select(`
            *,
            category:category_id (name),
            developer:developer_id (name, avatar_url)
          `)
          .eq('id', agentId)
          .single();

        if (agentError) throw agentError;
        
        if (agentData) {
          setAgent(agentData as AgentData);
          
          // Fetch test cases
          const { data: testData, error: testError } = await supabase
            .from('agents')
            .select('test_results')
            .eq('id', agentId)
            .single();
            
          if (testError) throw testError;
          
          if (testData && testData.test_results) {
            // Convert JSON data to TestCase[] type
            const parsedTestCases = Array.isArray(testData.test_results) 
              ? testData.test_results.map((tc: any): TestCase => ({
                  id: tc.id || crypto.randomUUID(),
                  name: tc.name || "Unnamed Test",
                  input: tc.input || "",
                  expectedOutput: tc.expectedOutput || "",
                  actualOutput: tc.actualOutput || "",
                  status: tc.status as "success" | "failure" | "pending" || "pending"
                }))
              : [];
            
            setTestCases(parsedTestCases);
          }
        }
      } catch (error) {
        console.error("Error fetching agent details:", error);
        // Use mock data for demo
        setAgent({
          id: agentId || "1",
          title: "Content Writer",
          description: "AI-powered content writer that can generate blog posts, articles, and more.",
          price: 0,
          category_id: "writing",
          status: "verified",
          developer_id: "developer-1",
          rating: 4.5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { name: "Writing" },
          developer: { name: "AI Developer", avatar_url: "" }
        });
        
        // Mock test cases
        setTestCases([
          { 
            id: "1", 
            name: "Basic greeting", 
            input: "Hello, how are you?", 
            expectedOutput: "I'm doing well, thank you for asking!",
            actualOutput: "I'm doing well, thank you for asking! How can I assist you today?",
            status: "success" 
          },
          { 
            id: "2", 
            name: "Article generation", 
            input: "Write a short paragraph about AI", 
            expectedOutput: "AI is transforming industries",
            actualOutput: "AI is transforming various industries by automating tasks and providing insights from data.",
            status: "success" 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agentId]);

  const handleSubmitReview = async () => {
    if (!agentId || rating === 0) return;
    
    try {
      // Submit review to Supabase
      const { error } = await supabase
        .from('agent_reviews')
        .insert({
          agent_id: agentId,
          user_id: 'current-user-id', // In production, use actual user ID
          rating,
          comment: reviewText,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update agent rating in agents table (simplified approach)
      if (agent) {
        const newRating = (agent.rating + rating) / 2; // Simple average, in production use weighted average
        
        const { error: updateError } = await supabase
          .from('agents')
          .update({ rating: newRating })
          .eq('id', agentId);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Demo functionality
  const [demoInput, setDemoInput] = useState("");
  const [demoOutput, setDemoOutput] = useState("");
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  
  const runDemo = () => {
    if (!demoInput.trim()) return;
    
    setIsDemoRunning(true);
    
    // Simulate API call to agent
    setTimeout(() => {
      setDemoOutput(`This is a simulated response to: "${demoInput}"\n\nIn a production environment, this would connect to the actual agent API and return real results based on your input.`);
      setIsDemoRunning(false);
    }, 1500);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 space-y-8">
        {agent && (
          <>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{agent.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {agent.category?.name || "Uncategorized"}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{agent.rating.toFixed(1)}</span>
                    </div>
                    <Badge 
                      variant={agent.status === "verified" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {agent.status === "verified" ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setActiveTab("demo")}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                  <Button variant="default">
                    {agent.price === 0 ? "Deploy Free" : `Buy $${agent.price.toFixed(2)}`}
                  </Button>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-5 w-full md:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="demo">Demo</TabsTrigger>
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                  <TabsTrigger value="testing">Testing</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Description</h3>
                    <p className="text-gray-700">{agent.description}</p>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-xl font-semibold mb-4">Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Advanced natural language processing</li>
                      <li>Multiple content formats (blog posts, social media, emails)</li>
                      <li>SEO optimization capabilities</li>
                      <li>Tone and style customization</li>
                    </ul>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-xl font-semibold mb-4">Technical Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Model</h4>
                        <p className="text-gray-700">GPT-4o</p>
                      </div>
                      <div>
                        <h4 className="font-medium">API Calls</h4>
                        <p className="text-gray-700">100/month included</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Response Time</h4>
                        <p className="text-gray-700">~1-2 seconds</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Last Updated</h4>
                        <p className="text-gray-700">{new Date(agent.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Developer</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                        {agent.developer?.avatar_url ? (
                          <img 
                            src={agent.developer.avatar_url} 
                            alt={agent.developer.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {agent.developer?.name?.charAt(0) || "A"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.developer?.name || "Anonymous Developer"}</h4>
                        <p className="text-gray-700 text-sm">Developer since {new Date(agent.created_at).getFullYear()}</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="demo" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Try the Agent</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="demo-input" className="block font-medium">Input</label>
                        <textarea 
                          id="demo-input"
                          value={demoInput}
                          onChange={(e) => setDemoInput(e.target.value)}
                          className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter your prompt here..."
                        ></textarea>
                      </div>
                      
                      <Button 
                        onClick={runDemo} 
                        disabled={isDemoRunning || !demoInput.trim()}
                        className="w-full md:w-auto"
                      >
                        {isDemoRunning ? "Running..." : "Run Demo"}
                      </Button>
                      
                      {demoOutput && (
                        <div className="space-y-2 mt-4">
                          <h4 className="font-medium">Output</h4>
                          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">
                            {demoOutput}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="config" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Configuration Options</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="api-key" className="block font-medium">API Key</label>
                        <input 
                          type="password" 
                          id="api-key"
                          className="w-full p-2 rounded-md border border-gray-300"
                          placeholder="Enter your API key"
                        />
                        <p className="text-xs text-gray-500">Required for deployment</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="retry-limit" className="block font-medium">Retry Limit</label>
                        <select 
                          id="retry-limit"
                          className="w-full p-2 rounded-md border border-gray-300"
                        >
                          <option value="1">1</option>
                          <option value="3" selected>3</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="timeout" className="block font-medium">Timeout (ms)</label>
                        <input 
                          type="number" 
                          id="timeout"
                          className="w-full p-2 rounded-md border border-gray-300"
                          defaultValue="30000"
                        />
                      </div>
                      
                      <Button>Save Configuration</Button>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Integration Guide</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">API Endpoint</h4>
                        <code className="block p-3 bg-gray-900 text-white rounded-md overflow-x-auto">
                          https://api.aimarketplace.com/agents/{agentId}/invoke
                        </code>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Example Request</h4>
                        <code className="block p-3 bg-gray-900 text-white rounded-md overflow-x-auto whitespace-pre">
{`fetch('https://api.aimarketplace.com/agents/${agentId}/invoke', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    input: "Your prompt here"
  })
})`}
                        </code>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="testing" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Test Cases</h3>
                    
                    {testCases.length === 0 ? (
                      <p className="text-gray-500">No test cases available</p>
                    ) : (
                      <div className="space-y-6">
                        {testCases.map((test) => (
                          <div key={test.id} className="border rounded-md p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{test.name}</h4>
                              <Badge 
                                variant={test.status === "success" ? "default" : "destructive"}
                              >
                                {test.status === "success" ? "Pass" : test.status === "failure" ? "Fail" : "Pending"}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Input</h5>
                                <p className="text-sm bg-gray-50 p-2 rounded">{test.input}</p>
                              </div>
                              
                              {test.expectedOutput && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-500">Expected Output</h5>
                                  <p className="text-sm bg-gray-50 p-2 rounded">{test.expectedOutput}</p>
                                </div>
                              )}
                              
                              {test.actualOutput && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-500">Actual Output</h5>
                                  <p className="text-sm bg-gray-50 p-2 rounded">{test.actualOutput}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Average Response Time</h4>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-5 w-5 text-primary" />
                          <span className="text-2xl font-bold">152ms</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Success Rate</h4>
                        <div className="flex items-center space-x-2">
                          <BarChart className="h-5 w-5 text-green-500" />
                          <span className="text-2xl font-bold">98.5%</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Total Calls</h4>
                        <div className="flex items-center space-x-2">
                          <Code className="h-5 w-5 text-blue-500" />
                          <span className="text-2xl font-bold">1,248</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Error Rate</h4>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-5 w-5 text-red-500" />
                          <span className="text-2xl font-bold">1.5%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">Great content creator</span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          This agent has been extremely helpful for creating consistent content for my blog. 
                          The writing quality is excellent, and it follows my style guides perfectly.
                        </p>
                        <p className="text-sm text-gray-500">Jane Smith - 2 weeks ago</p>
                      </div>
                      
                      <div className="border-b pb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400" />
                          <Star className="h-5 w-5 text-gray-300" />
                          <span className="font-medium">Good but needs some tweaking</span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          The agent generates good content overall, but sometimes misses the mark on technical topics.
                          Good value for the price though.
                        </p>
                        <p className="text-sm text-gray-500">John Doe - 1 month ago</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>
                    <ReviewForm 
                      agentId={agentId || ""}
                      onReviewSubmit={handleSubmitReview}
                      reviewText={reviewText}
                      setReviewText={setReviewText}
                      rating={rating}
                      setRating={setRating}
                    />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
