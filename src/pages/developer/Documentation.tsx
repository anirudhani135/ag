import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchX, Code, FileJson, Webhook, PlayCircle, Book, Copy, CheckCircle, Server, ExternalLink, HelpCircle, DownloadCloud } from "lucide-react";

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documentation</h2>
          <p className="text-muted-foreground">
            Explore our comprehensive documentation to integrate and utilize our platform effectively.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <Input
              type="search"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pr-10"
            />
            {searchQuery && (
              <SearchX className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground cursor-pointer" onClick={() => handleSearch("")} />
            )}
          </div>
          <Button variant="outline">
            <HelpCircle className="h-4 w-4 mr-2" />
            Need Help?
          </Button>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <TabsTrigger value="getting-started" className="text-sm md:text-base">Getting Started</TabsTrigger>
            <TabsTrigger value="api-reference" className="text-sm md:text-base">API Reference</TabsTrigger>
            <TabsTrigger value="sdks" className="text-sm md:text-base">SDKs</TabsTrigger>
            <TabsTrigger value="tutorials" className="text-sm md:text-base">Tutorials</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
                <CardDescription>
                  Welcome to our platform! Get started with the basics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our platform provides powerful tools for AI agent creation and management.
                  This guide will walk you through the initial setup and key concepts.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Create an account and obtain your API key.</li>
                  <li>Explore the dashboard and familiarize yourself with the interface.</li>
                  <li>Start building your first AI agent using our intuitive creation tools.</li>
                </ul>
                <Button variant="secondary">
                  <Book className="h-4 w-4 mr-2" />
                  Read Full Guide
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Learn how to authenticate your requests using your API key.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Authentication is required for all API requests. Include your API key in the
                  <code>Authorization</code> header as a Bearer token.
                </p>
                <div className="bg-muted rounded-md p-4 font-mono text-sm">
                  <code className="break-words">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                  <Button variant="ghost" size="sm" className="float-right -mt-2">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p>
                  Ensure your API key is kept secure. Do not share it publicly or include it in
                  client-side code.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-reference" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Endpoints</CardTitle>
                <CardDescription>
                  Explore our API endpoints for managing AI agents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Create Agent</h3>
                    <Badge variant="secondary">POST</Badge>
                  </div>
                  <div className="bg-muted rounded-md p-4 font-mono text-sm">
                    <code className="break-words">
                      /api/agents
                    </code>
                    <Button variant="ghost" size="sm" className="float-right -mt-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p>
                    Create a new AI agent with specified configurations.
                  </p>
                  <div className="flex items-center">
                    <FileJson className="h-4 w-4 mr-2" />
                    <a href="#" className="text-primary hover:underline">
                      View Request Body Example
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <a href="#" className="text-primary hover:underline">
                      View Response Example
                    </a>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Update Agent</h3>
                    <Badge variant="secondary">PUT</Badge>
                  </div>
                  <div className="bg-muted rounded-md p-4 font-mono text-sm">
                    <code className="break-words">
                      /api/agents/&#123;agentId&#125;
                    </code>
                    <Button variant="ghost" size="sm" className="float-right -mt-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p>
                    Update an existing AI agent with new configurations.
                  </p>
                  <div className="flex items-center">
                    <FileJson className="h-4 w-4 mr-2" />
                    <a href="#" className="text-primary hover:underline">
                      View Request Body Example
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <a href="#" className="text-primary hover:underline">
                      View Response Example
                    </a>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Delete Agent</h3>
                    <Badge variant="destructive">DELETE</Badge>
                  </div>
                  <div className="bg-muted rounded-md p-4 font-mono text-sm">
                    <code className="break-words">
                      /api/agents/&#123;agentId&#125;
                    </code>
                    <Button variant="ghost" size="sm" className="float-right -mt-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p>
                    Delete an AI agent from your account.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Agent Webhook</h3>
                    <Badge variant="outline">WEBHOOK</Badge>
                  </div>
                  <div className="bg-muted rounded-md p-4 font-mono text-sm">
                    <code className="break-words">
                      /api/webhooks/agents/&#123;agentId&#125;
                    </code>
                    <Button variant="ghost" size="sm" className="float-right -mt-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p>
                    Configure webhooks to receive real-time updates on agent events.
                  </p>
                  <div className="flex items-center">
                    <Webhook className="h-4 w-4 mr-2" />
                    <a href="#" className="text-primary hover:underline">
                      View Webhook Documentation
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SDKs</CardTitle>
                <CardDescription>
                  Integrate our platform with your favorite languages and frameworks using our SDKs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">JavaScript SDK</h4>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Build AI agents in JavaScript with our comprehensive SDK.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Easy Integration</span>
                      </div>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Python SDK</h4>
                      <Badge variant="outline">Beta</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Develop AI agents in Python with our flexible SDK.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Data Science Ready</span>
                      </div>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tutorials</CardTitle>
                <CardDescription>
                  Learn how to build and deploy AI agents with our step-by-step tutorials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-semibold">Build a Customer Support Agent</h4>
                    <p className="text-sm text-muted-foreground">
                      Create an AI agent to handle customer inquiries and provide support 24/7.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2" />
                        <span className="text-sm">Deployment Ready</span>
                      </div>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Tutorial
                      </a>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-semibold">Automate Content Creation</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate blog posts, articles, and marketing copy with an AI content writer.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span className="text-sm">SEO Optimized</span>
                      </div>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Tutorial
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
