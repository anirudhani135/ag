
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Copy, Search, ExternalLink, BookOpen } from "lucide-react";

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("getting-started");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Developer Documentation</h2>
          <p className="text-muted-foreground">
            Complete guides and references for integrating with our platform
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documentation..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "getting-started" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("getting-started")}
                  >
                    Getting Started
                  </Button>
                  <Button
                    variant={activeTab === "api-reference" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("api-reference")}
                  >
                    API Reference
                  </Button>
                  <Button
                    variant={activeTab === "guides" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("guides")}
                  >
                    Guides & Tutorials
                  </Button>
                  <Button
                    variant={activeTab === "sdks" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("sdks")}
                  >
                    SDKs & Libraries
                  </Button>
                  <Button
                    variant={activeTab === "webhooks" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("webhooks")}
                  >
                    Webhooks
                  </Button>
                  <Button
                    variant={activeTab === "faq" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("faq")}
                  >
                    FAQ
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 sm:grid-cols-6">
                    <TabsTrigger value="getting-started">Intro</TabsTrigger>
                    <TabsTrigger value="api-reference">API</TabsTrigger>
                    <TabsTrigger value="guides">Guides</TabsTrigger>
                    <TabsTrigger value="sdks">SDKs</TabsTrigger>
                    <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="getting-started" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Getting Started with the Agent Platform</h3>
                    <p className="text-muted-foreground">
                      Learn how to create, deploy, and manage AI agents that can solve specific use cases for your customers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">1. Create Your First Agent</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Start by navigating to the Agent Creation page and defining your agent's purpose and capabilities.
                      </p>
                      <Button variant="outline" size="sm">Read Guide</Button>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">2. Configure Your Agent</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set up your agent's parameters, knowledge base, and behavior to optimize for your use case.
                      </p>
                      <Button variant="outline" size="sm">Read Guide</Button>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">3. Deploy Your Agent</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Learn how to deploy your agent to make it available to users with proper scaling and monitoring.
                      </p>
                      <Button variant="outline" size="sm">Read Guide</Button>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">4. Integrate With Your Services</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Connect your agent with your existing services via API or webhooks for enhanced functionality.
                      </p>
                      <Button variant="outline" size="sm">Read Guide</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="api-reference" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">API Reference</h3>
                    <p className="text-muted-foreground">
                      Complete reference documentation for all available API endpoints, parameters, and response formats.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        All API requests require authentication using your API key in the Authorization header.
                      </p>
                      <div className="bg-slate-100 p-3 rounded-md font-mono text-sm">
                        <div className="flex justify-between items-center">
                          <code>Authorization: Bearer YOUR_API_KEY</code>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">API Endpoints</h4>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">GET</span>
                            <code className="font-mono text-sm">/api/v1/agents</code>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/v1/agents")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">List all your agents with optional filtering</p>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">GET</span>
                            <code className="font-mono text-sm">/api/v1/agents/{"{agent_id}"}</code>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/v1/agents/{agent_id}")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Get details for a specific agent</p>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">POST</span>
                            <code className="font-mono text-sm">/api/v1/agents</code>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/v1/agents")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Create a new agent</p>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs mr-2">PUT</span>
                            <code className="font-mono text-sm">/api/v1/agents/{"{agent_id}"}</code>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/v1/agents/{agent_id}")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Update an existing agent</p>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs mr-2">DELETE</span>
                            <code className="font-mono text-sm">/api/v1/agents/{"{agent_id}"}</code>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/v1/agents/{agent_id}")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Delete an agent</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="guides" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Guides & Tutorials</h3>
                    <p className="text-muted-foreground">
                      Step-by-step tutorials to help you master agent development and integration.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Creating an AI Customer Support Agent</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Learn how to build an agent that can handle common customer inquiries and escalate when necessary.
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">15 min read</Badge>
                            <Button variant="outline" size="sm">View Tutorial</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Integrating Your Agent with Slack</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Connect your AI agent to Slack to provide assistance directly in your team's workspace.
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">10 min read</Badge>
                            <Button variant="outline" size="sm">View Tutorial</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Optimizing Agent Performance</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Techniques to improve response quality, reduce latency, and enhance user experience.
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">20 min read</Badge>
                            <Button variant="outline" size="sm">View Tutorial</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Building Multi-Modal Agents</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Create agents that can process and respond to text, images, and other input formats.
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">25 min read</Badge>
                            <Button variant="outline" size="sm">View Tutorial</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sdks" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">SDKs & Libraries</h3>
                    <p className="text-muted-foreground">
                      Official client libraries to integrate with our platform in your preferred programming language.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">JavaScript / TypeScript</h4>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          Integrate our platform in web applications, Node.js services, or React Native apps.
                        </p>
                        
                        <div className="bg-slate-100 p-3 rounded-md font-mono text-sm mb-4">
                          <div className="flex justify-between items-center">
                            <code>npm install @agent-platform/js</code>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard("npm install @agent-platform/js")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Documentation</Button>
                          <Button variant="outline" size="sm">Examples</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Python</h4>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          Perfect for data science applications, backend services, or AI/ML integrations.
                        </p>
                        
                        <div className="bg-slate-100 p-3 rounded-md font-mono text-sm mb-4">
                          <div className="flex justify-between items-center">
                            <code>pip install agent-platform</code>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard("pip install agent-platform")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Documentation</Button>
                          <Button variant="outline" size="sm">Examples</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Java</h4>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          For enterprise applications, Android development, or Spring-based services.
                        </p>
                        
                        <div className="bg-slate-100 p-3 rounded-md font-mono text-sm mb-4">
                          <div className="flex justify-between items-center">
                            <code>implementation 'com.agent-platform:sdk:1.0.0'</code>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard("implementation 'com.agent-platform:sdk:1.0.0'")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Documentation</Button>
                          <Button variant="outline" size="sm">Examples</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Go</h4>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          Ideal for high-performance microservices and cloud native applications.
                        </p>
                        
                        <div className="bg-slate-100 p-3 rounded-md font-mono text-sm mb-4">
                          <div className="flex justify-between items-center">
                            <code>go get github.com/agent-platform/go-sdk</code>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard("go get github.com/agent-platform/go-sdk")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Documentation</Button>
                          <Button variant="outline" size="sm">Examples</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="webhooks" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Webhooks</h3>
                    <p className="text-muted-foreground">
                      Configure webhooks to receive real-time notifications for platform events.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Webhook Events Reference</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        All the events you can subscribe to via webhooks and their payload structures.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md">
                          <div>
                            <code className="font-mono text-sm">agent.deployed</code>
                            <p className="text-xs text-muted-foreground">Triggered when an agent is deployed to production</p>
                          </div>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md">
                          <div>
                            <code className="font-mono text-sm">agent.updated</code>
                            <p className="text-xs text-muted-foreground">Triggered when an agent configuration is updated</p>
                          </div>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md">
                          <div>
                            <code className="font-mono text-sm">agent.error</code>
                            <p className="text-xs text-muted-foreground">Triggered when an agent encounters an error</p>
                          </div>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md">
                          <div>
                            <code className="font-mono text-sm">conversation.started</code>
                            <p className="text-xs text-muted-foreground">Triggered when a new conversation begins with an agent</p>
                          </div>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md">
                          <div>
                            <code className="font-mono text-sm">conversation.completed</code>
                            <p className="text-xs text-muted-foreground">Triggered when a conversation with an agent completes</p>
                          </div>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Best Practices for Webhook Implementation</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Implement retry logic to handle temporary failures</li>
                        <li>Verify webhook signatures to ensure security</li>
                        <li>Respond quickly to webhook deliveries (under 3 seconds)</li>
                        <li>Use a dedicated endpoint for each webhook type</li>
                        <li>Implement proper error handling for webhook processing</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
                    <p className="text-muted-foreground">
                      Answers to common questions about agent development and platform usage.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">What is an AI Agent?</h4>
                      <p className="text-sm text-muted-foreground">
                        An AI Agent is an autonomous program that can perceive its environment, make decisions, and take actions to achieve specific goals. Our platform enables you to create specialized AI agents that can perform tasks like customer support, data analysis, creative content generation, and more.
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">How do I customize my agent's behavior?</h4>
                      <p className="text-sm text-muted-foreground">
                        You can customize your agent's behavior through the configuration settings in the Agent Creation interface. This includes setting parameters for response style, knowledge base sources, permitted actions, and more. For advanced customization, you can also use our API to programmatically define your agent's capabilities.
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">What are the usage limits?</h4>
                      <p className="text-sm text-muted-foreground">
                        Usage limits depend on your subscription plan. Free tier accounts have limits on the number of API calls, conversations, and deployed agents. Paid plans offer higher limits and the ability to handle more concurrent users. You can view your current usage and limits in the Developer Dashboard.
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">How is billing calculated?</h4>
                      <p className="text-sm text-muted-foreground">
                        Billing is based on a combination of factors including the number of API calls, the complexity of requests, and the number of deployed agents. We provide detailed analytics in the Revenue section of your Developer Dashboard so you can track costs and optimize your usage.
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Can I integrate my agent with my existing systems?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, you can integrate your agent with existing systems using our API and webhooks. We provide SDKs for popular programming languages to make integration easier. You can also use custom functions to connect your agent to external APIs and databases.
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">How do I monitor my agent's performance?</h4>
                      <p className="text-sm text-muted-foreground">
                        The Analytics Dashboard provides comprehensive metrics on your agent's performance, including response times, error rates, user engagement, and more. You can also set up alerts for performance issues and receive real-time notifications through webhooks.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
