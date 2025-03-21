
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  SearchX, Code, FileJson, Webhook, PlayCircle, Book, 
  Copy, CheckCircle, Server, ExternalLink, HelpCircle, 
  DownloadCloud, Globe, Database, Cpu, Bot, MessageCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCopy = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    
    toast({
      title: "Copied to clipboard",
      description: description,
    });

    setTimeout(() => {
      setCopiedText("");
    }, 2000);
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
          <TabsList className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <TabsTrigger value="getting-started" className="text-sm md:text-base">Getting Started</TabsTrigger>
            <TabsTrigger value="api-reference" className="text-sm md:text-base">API Reference</TabsTrigger>
            <TabsTrigger value="sdks" className="text-sm md:text-base">SDKs</TabsTrigger>
            <TabsTrigger value="deployment" className="text-sm md:text-base">Deployment</TabsTrigger>
            <TabsTrigger value="ai-models" className="text-sm md:text-base">AI Models</TabsTrigger>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="float-right -mt-2"
                    onClick={() => handleCopy("Authorization: Bearer YOUR_API_KEY", "Authorization header copied to clipboard")}
                  >
                    {copiedText === "Authorization: Bearer YOUR_API_KEY" ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="float-right -mt-2"
                      onClick={() => handleCopy("/api/agents", "Endpoint copied to clipboard")}
                    >
                      {copiedText === "/api/agents" ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="float-right -mt-2"
                      onClick={() => handleCopy("/api/agents/{agentId}", "Endpoint copied to clipboard")}
                    >
                      {copiedText === "/api/agents/{agentId}" ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="float-right -mt-2"
                      onClick={() => handleCopy("/api/agents/{agentId}", "Endpoint copied to clipboard")}
                    >
                      {copiedText === "/api/agents/{agentId}" ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="float-right -mt-2"
                      onClick={() => handleCopy("/api/webhooks/agents/{agentId}", "Webhook endpoint copied to clipboard")}
                    >
                      {copiedText === "/api/webhooks/agents/{agentId}" ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
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

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Deployment Guide</CardTitle>
                <CardDescription>
                  Learn how to deploy your AI agents to make them available to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <h3 className="text-lg font-medium">Deployment Methods</h3>
                <p>
                  Our platform supports multiple methods for deploying AI agents. Choose the method that best suits your requirements:
                </p>
                
                <div className="space-y-8 mt-4">
                  {/* API Integration Method */}
                  <div className="border rounded-md p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold">API Integration</h4>
                    </div>
                    
                    <p className="mb-4 text-muted-foreground">
                      Connect to your own API endpoint where your agent logic is hosted. This method gives you complete control over how your agent processes requests.
                    </p>
                    
                    <div className="space-y-4">
                      <h5 className="font-medium">Step-by-Step Guide:</h5>
                      <ol className="list-decimal ml-5 space-y-2">
                        <li>Build your AI agent on your own server or cloud provider.</li>
                        <li>Expose an API endpoint that accepts POST requests in our required format.</li>
                        <li>Go to your developer dashboard and select "Deploy External Agent".</li>
                        <li>Select "API Integration" as your deployment method.</li>
                        <li>Enter your API endpoint URL and optional API key for authentication.</li>
                        <li>Complete the form with agent details (name, description, pricing).</li>
                        <li>Submit for deployment and track the deployment progress.</li>
                      </ol>
                      
                      <div className="bg-slate-50 border rounded p-4 mt-4">
                        <h6 className="font-medium mb-2">Example API Request Format:</h6>
                        <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
{`POST /your-api-endpoint HTTP/1.1
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "message": "User query text",
  "conversation_id": "conv_123456",
  "user_id": "user_789012",
  "metadata": {
    "source": "marketplace",
    "client_info": {
      "device": "mobile",
      "browser": "chrome"
    }
  }
}`}
                        </pre>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="mt-2"
                          onClick={() => handleCopy(`POST /your-api-endpoint HTTP/1.1
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "message": "User query text",
  "conversation_id": "conv_123456",
  "user_id": "user_789012",
  "metadata": {
    "source": "marketplace",
    "client_info": {
      "device": "mobile",
      "browser": "chrome"
    }
  }
}`, "Example API request copied to clipboard")}
                        >
                          <Copy className="h-3 w-3 mr-1" /> Copy
                        </Button>
                      </div>
                      
                      <div className="bg-slate-50 border rounded p-4">
                        <h6 className="font-medium mb-2">Example API Response Format:</h6>
                        <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
{`{
  "response": "This is the agent's response to the user query.",
  "conversation_id": "conv_123456",
  "metadata": {
    "confidence": 0.92,
    "processing_time": 0.45,
    "sources": [
      {
        "title": "Source document",
        "url": "https://example.com/source"
      }
    ]
  }
}`}
                        </pre>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="mt-2"
                          onClick={() => handleCopy(`{
  "response": "This is the agent's response to the user query.",
  "conversation_id": "conv_123456",
  "metadata": {
    "confidence": 0.92,
    "processing_time": 0.45,
    "sources": [
      {
        "title": "Source document",
        "url": "https://example.com/source"
      }
    ]
  }
}`, "Example API response copied to clipboard")}
                        >
                          <Copy className="h-3 w-3 mr-1" /> Copy
                        </Button>
                      </div>
                    </div>
                    
                    <Card className="mt-6 bg-blue-50 border-blue-100">
                      <CardContent className="pt-4">
                        <h6 className="font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                          Real-World Example
                        </h6>
                        <p className="text-sm mt-2">
                          A restaurant recommendation agent deployed via API integration. The API endpoint processes user queries about food preferences and location, then returns personalized restaurant suggestions. The agent uses proprietary data and algorithms that remain on your servers.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* LangFlow Method */}
                  <div className="border rounded-md p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Database className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="text-lg font-semibold">LangFlow Configuration</h4>
                    </div>
                    
                    <p className="mb-4 text-muted-foreground">
                      Upload a LangFlow JSON configuration to deploy your agent with zero coding. Perfect for quick deployment of LangChain-based agents.
                    </p>
                    
                    <div className="space-y-4">
                      <h5 className="font-medium">Step-by-Step Guide:</h5>
                      <ol className="list-decimal ml-5 space-y-2">
                        <li>Design your agent flow in LangFlow and export it as a JSON file.</li>
                        <li>Go to your developer dashboard and select "Deploy External Agent".</li>
                        <li>Select "LangFlow" as your deployment method.</li>
                        <li>Upload your LangFlow JSON configuration file.</li>
                        <li>Complete the agent details form (name, description, pricing).</li>
                        <li>Submit for deployment and track the deployment progress.</li>
                      </ol>
                      
                      <div className="bg-slate-50 border rounded p-4 mt-4">
                        <h6 className="font-medium mb-2">Example LangFlow Configuration Structure:</h6>
                        <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
{`{
  "nodes": [
    {
      "id": "langchain_conversational",
      "data": {
        "llm": {"id": "openai_model", "type": "llm"},
        "memory": {"id": "memory_storage", "type": "memory"},
        "prompt_template": "You are an assistant specialized in {topic}."
      }
    },
    {
      "id": "openai_model",
      "data": {
        "model_name": "gpt-4o",
        "temperature": 0.7,
        "max_tokens": 1000
      }
    },
    {
      "id": "memory_storage",
      "data": {
        "type": "buffer_memory",
        "k": 5
      }
    }
  ],
  "edges": [
    {
      "source": "openai_model",
      "target": "langchain_conversational"
    },
    {
      "source": "memory_storage",
      "target": "langchain_conversational"
    }
  ]
}`}
                        </pre>
                        <p className="text-xs mt-2 text-muted-foreground">
                          Note: This is a simplified example. Actual LangFlow configurations will be more complex and include all necessary parameters.
                        </p>
                      </div>
                    </div>
                    
                    <Card className="mt-6 bg-purple-50 border-purple-100">
                      <CardContent className="pt-4">
                        <h6 className="font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                          Real-World Example
                        </h6>
                        <p className="text-sm mt-2">
                          A customer support agent built with LangFlow that uses a combination of retrieval augmented generation (RAG) with your company's knowledge base and a chat interface. The agent can answer product questions, troubleshoot issues, and escalate to human support when needed.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Custom Integration Method */}
                  <div className="border rounded-md p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Code className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold">Custom Integration</h4>
                    </div>
                    
                    <p className="mb-4 text-muted-foreground">
                      Work with our team to create a custom integration for complex agents that require special infrastructure or deep integration with our platform.
                    </p>
                    
                    <div className="space-y-4">
                      <h5 className="font-medium">Step-by-Step Guide:</h5>
                      <ol className="list-decimal ml-5 space-y-2">
                        <li>Contact our support team to discuss your custom integration needs.</li>
                        <li>Work with our engineers to define integration requirements and specifications.</li>
                        <li>Develop your agent with guidance from our team.</li>
                        <li>Go to your developer dashboard and select "Deploy External Agent".</li>
                        <li>Select "Custom Integration" as your deployment method.</li>
                        <li>Enter the custom integration details provided by our team.</li>
                        <li>Complete the agent details form (name, description, pricing).</li>
                        <li>Submit for deployment and our team will handle the rest.</li>
                      </ol>
                    </div>
                    
                    <Card className="mt-6 bg-green-50 border-green-100">
                      <CardContent className="pt-4">
                        <h6 className="font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Real-World Example
                        </h6>
                        <p className="text-sm mt-2">
                          An intelligent content creation agent that requires access to our platform's file storage system, user permission system, and billing system. The custom integration allows the agent to securely generate and store content directly in users' accounts while handling usage billing correctly.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium">Deployment Best Practices</h3>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>Test your agent thoroughly before deployment to ensure it provides quality responses.</li>
                    <li>Start with a "Private" deployment to test with selected users before making it available to everyone.</li>
                    <li>Include detailed documentation for users to understand what your agent does and how to use it effectively.</li>
                    <li>Implement proper error handling and logging to troubleshoot issues after deployment.</li>
                    <li>Set up monitoring for your agent's performance and usage to identify areas for improvement.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-models" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Supported AI Models</CardTitle>
                <CardDescription>
                  Explore the range of AI models available for integration with your agents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Our platform supports integration with leading AI model providers. You can deploy agents powered by any of these models:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* OpenAI */}
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Cpu className="h-5 w-5 mr-2 text-emerald-600" />
                        OpenAI Models
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">GPT-4o</span>
                          <Badge variant="outline" className="bg-emerald-50">Recommended</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          OpenAI's most advanced multimodal model, optimized for both text and vision tasks.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">GPT-4o Mini</span>
                        <p className="text-sm text-muted-foreground">
                          A smaller, faster, and more cost-effective version of GPT-4o.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">GPT-4o-Realtime</span>
                        <p className="text-sm text-muted-foreground">
                          Optimized for interactive, realtime conversations and voice applications.
                        </p>
                      </div>

                      <div className="pt-2">
                        <a href="#" className="text-primary text-sm hover:underline flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View OpenAI integration guide
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Anthropic */}
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Cpu className="h-5 w-5 mr-2 text-indigo-600" />
                        Anthropic Models
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Claude 3.5 Sonnet</span>
                          <Badge variant="outline" className="bg-indigo-50">Recommended</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Anthropic's powerful model with excellent reasoning and instruction following capabilities.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">Claude 3 Opus</span>
                        <p className="text-sm text-muted-foreground">
                          Anthropic's most powerful model for complex tasks requiring deep expertise.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">Claude 3 Haiku</span>
                        <p className="text-sm text-muted-foreground">
                          Fast and efficient model for simpler tasks and high-volume applications.
                        </p>
                      </div>

                      <div className="pt-2">
                        <a href="#" className="text-primary text-sm hover:underline flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Anthropic integration guide
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* LLama and Open Source */}
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Cpu className="h-5 w-5 mr-2 text-amber-600" />
                        Meta & Open Source
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <span className="font-medium">Llama 3 (70B)</span>
                        <p className="text-sm text-muted-foreground">
                          Meta's powerful open model with strong reasoning and general knowledge capabilities.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">Llama 3 (8B)</span>
                        <p className="text-sm text-muted-foreground">
                          Smaller variant suitable for deployment in more resource-constrained environments.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">Mistral Large</span>
                        <p className="text-sm text-muted-foreground">
                          Powerful open-weight model with strong reasoning capabilities.
                        </p>
                      </div>

                      <div className="pt-2">
                        <a href="#" className="text-primary text-sm hover:underline flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View open source model integration
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Multimodal Models */}
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Bot className="h-5 w-5 mr-2 text-blue-600" />
                        Multimodal Models
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <span className="font-medium">GPT-4o Vision</span>
                        <p className="text-sm text-muted-foreground">
                          Process and respond to image inputs alongside text. Perfect for visual analysis tasks.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">Claude 3.5 Sonnet Vision</span>
                        <p className="text-sm text-muted-foreground">
                          Anthropic's model with powerful image understanding capabilities.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="font-medium">Gemini 1.5 Pro</span>
                        <p className="text-sm text-muted-foreground">
                          Google's multimodal model that excels at processing text, images, and video.
                        </p>
                      </div>

                      <div className="pt-2">
                        <a href="#" className="text-primary text-sm hover:underline flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View multimodal integration guide
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium">Model Integration Examples</h3>
                  
                  <Card className="bg-slate-50 border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">OpenAI Integration Example</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
{`// Example API Integration with OpenAI's GPT-4o
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7
  })
});

const data = await response.json();
return data.choices[0].message.content;`}
                      </pre>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleCopy(`// Example API Integration with OpenAI's GPT-4o
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7
  })
});

const data = await response.json();
return data.choices[0].message.content;`, "Example code copied to clipboard")}
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy Code
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-50 border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Anthropic Integration Example</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
{`// Example API Integration with Anthropic's Claude
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1000,
    messages: [
      { role: 'user', content: userMessage }
    ],
    system: 'You are a helpful assistant.'
  })
});

const data = await response.json();
return data.content[0].text;`}
                      </pre>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleCopy(`// Example API Integration with Anthropic's Claude
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1000,
    messages: [
      { role: 'user', content: userMessage }
    ],
    system: 'You are a helpful assistant.'
  })
});

const data = await response.json();
return data.content[0].text;`, "Example code copied to clipboard")}
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy Code
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6">
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Need Help With Model Integration?
                  </h3>
                  <p className="text-sm">
                    Our team can help you choose the right model for your use case and guide you through the integration process.
                    Contact our developer support for personalized assistance.
                  </p>
                  <Button className="mt-3" variant="outline">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Developer Support
                  </Button>
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
