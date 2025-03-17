
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Search, BookOpen, Code, Webhook, MessageSquare, Database, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { useState } from "react";

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout type="developer">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground">
              Comprehensive guides, API references, and examples to help you build with our platform.
            </p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="sdks" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">SDKs</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              <span className="hidden sm:inline">Webhooks</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with Agent Development</CardTitle>
                <CardDescription>
                  Learn how to create, configure, and deploy your first AI agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our platform provides a powerful framework for creating AI agents that can be integrated into various applications and services. This guide will walk you through the process of creating your first agent, configuring its capabilities, and deploying it to production.
                </p>
                <h3 className="text-lg font-semibold mt-4">Agent Creation Steps</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Define your agent's basic information and purpose</li>
                  <li>Configure model parameters and capabilities</li>
                  <li>Set up integrations with external services (optional)</li>
                  <li>Create and run test cases to validate performance</li>
                  <li>Deploy your agent to production</li>
                </ol>
                <div className="mt-4">
                  <Button variant="outline" className="mr-2">Read Full Guide</Button>
                  <Button variant="secondary">View Examples</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Testing and Optimization</CardTitle>
                  <CardDescription>Best practices for testing and improving agent performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Learn how to create comprehensive test suites to validate your agent's responses across different scenarios. Understand performance metrics and optimization techniques.</p>
                  <Button variant="link" className="mt-4 p-0">Read more →</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Integration Guide</CardTitle>
                  <CardDescription>Connect your agent with external services and APIs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Discover how to integrate your agent with databases, APIs, and third-party services to enhance its capabilities and create more powerful automated workflows.</p>
                  <Button variant="link" className="mt-4 p-0">Read more →</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Strategies</CardTitle>
                  <CardDescription>Learn about different deployment options and best practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Understand different deployment environments, scaling strategies, and monitoring approaches to ensure your agent runs reliably in production.</p>
                  <Button variant="link" className="mt-4 p-0">Read more →</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monetization Guide</CardTitle>
                  <CardDescription>Ways to monetize your AI agents on the marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Explore different pricing models, marketing strategies, and analytics tools to optimize the commercial success of your agents in the marketplace.</p>
                  <Button variant="link" className="mt-4 p-0">Read more →</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Complete reference documentation for our RESTful API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                  <p className="mb-2">All API requests require authentication using an API key.</p>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Agents API</h3>
                      <Badge variant="outline">v1.0</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">Manage and deploy AI agents</p>
                    <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                      <code className="text-sm">GET /api/v1/agents</code>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Deployments API</h3>
                      <Badge variant="outline">v1.0</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">Deploy and manage agent instances</p>
                    <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                      <code className="text-sm">POST /api/v1/deployments</code>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Analytics API</h3>
                      <Badge variant="outline">v1.0</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">Retrieve performance and usage analytics</p>
                    <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                      <code className="text-sm">GET /api/v1/analytics</code>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Transactions API</h3>
                      <Badge variant="outline">v1.0</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">Retrieve transaction history and revenue data</p>
                    <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                      <code className="text-sm">GET /api/v1/transactions</code>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="mt-6">View Full API Documentation</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SDK Documentation</CardTitle>
                <CardDescription>
                  Client libraries for integrating with our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">JavaScript SDK</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="mb-4">Our official JavaScript SDK for browser and Node.js applications.</p>
                      <div className="bg-muted p-2 rounded-md font-mono text-sm mb-4">
                        npm install @platform/js-sdk
                      </div>
                      <Button variant="outline" size="sm" className="mr-2">Documentation</Button>
                      <Button variant="secondary" size="sm">Examples</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Python SDK</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="mb-4">Our official Python SDK for server-side integration.</p>
                      <div className="bg-muted p-2 rounded-md font-mono text-sm mb-4">
                        pip install platform-sdk
                      </div>
                      <Button variant="outline" size="sm" className="mr-2">Documentation</Button>
                      <Button variant="secondary" size="sm">Examples</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Java SDK</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="mb-4">Our official Java SDK for enterprise applications.</p>
                      <div className="bg-muted p-2 rounded-md font-mono text-sm mb-4">
                        &lt;dependency&gt;
                          &lt;groupId&gt;com.platform&lt;/groupId&gt;
                          &lt;artifactId&gt;sdk&lt;/artifactId&gt;
                        &lt;/dependency&gt;
                      </div>
                      <Button variant="outline" size="sm" className="mr-2">Documentation</Button>
                      <Button variant="secondary" size="sm">Examples</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Go SDK</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="mb-4">Our official Go SDK for backend services.</p>
                      <div className="bg-muted p-2 rounded-md font-mono text-sm mb-4">
                        go get github.com/platform/sdk
                      </div>
                      <Button variant="outline" size="sm" className="mr-2">Documentation</Button>
                      <Button variant="secondary" size="sm">Examples</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Receive real-time notifications for platform events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Webhooks allow your application to receive real-time updates about events that happen in our platform. You can configure webhooks to notify your systems about agent deployments, purchases, reviews, and more.
                </p>

                <h3 className="text-lg font-semibold mb-4">Available Webhook Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium">agent.deployed</h4>
                      <p className="text-sm text-muted-foreground">Triggered when an agent is deployed to production</p>
                    </div>
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium">agent.purchased</h4>
                      <p className="text-sm text-muted-foreground">Triggered when someone purchases your agent</p>
                    </div>
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium">agent.review.created</h4>
                      <p className="text-sm text-muted-foreground">Triggered when a new review is submitted for your agent</p>
                    </div>
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium">subscription.renewed</h4>
                      <p className="text-sm text-muted-foreground">Triggered when a subscription is renewed</p>
                    </div>
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Webhook Format</h3>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {`{
  "event": "agent.deployed",
  "timestamp": "2023-06-01T12:00:00Z",
  "data": {
    "agent_id": "ag_12345",
    "version": "1.0.0",
    "deployment_id": "dep_67890",
    "status": "successful"
  }
}`}
                  </div>
                </div>

                <Button className="mt-6">Set Up Webhooks</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions about development and platform usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">What types of agents can I build on this platform?</h3>
                  <p>
                    Our platform supports a wide range of AI agents, including conversational assistants, data analysis agents, content generation agents, automation agents, and more. You can customize agents to fit specific industry needs or general use cases.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">How do I manage versioning for my agents?</h3>
                  <p>
                    Our platform provides built-in versioning capabilities. Each time you make changes to your agent, you can save it as a draft, test it, and then publish a new version. You can roll back to previous versions if needed, and track performance metrics across different versions.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">What are the pricing options for developers?</h3>
                  <p>
                    Developers can choose between different revenue models: fixed price, subscription-based, or usage-based pricing. You can set your own prices and our platform handles the payment processing. We take a platform fee of 15% on all transactions.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">How does testing work?</h3>
                  <p>
                    You can create test cases with sample inputs and expected outputs. The platform will automatically evaluate your agent's responses against these test cases and provide performance metrics. You can also conduct manual testing through the chat interface.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">Can I integrate external APIs with my agent?</h3>
                  <p>
                    Yes, you can integrate external APIs and services with your agent using our API integration framework. This allows your agent to fetch data, perform actions, or integrate with existing systems and databases to enhance its capabilities.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">How do I monitor my agent's performance?</h3>
                  <p>
                    The platform provides detailed analytics dashboards where you can monitor usage metrics, error rates, response times, user feedback, and revenue data. You can set up alerts for critical performance issues and receive regular reports.
                  </p>
                </div>

                <Button className="mt-4">View All FAQs</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
