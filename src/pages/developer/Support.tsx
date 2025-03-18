
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LifeBuoy, 
  MessageSquare, 
  FileQuestion, 
  Book, 
  ChevronRight, 
  Send,
  Check,
  AlertCircle,
  Code,
  Server,
  Database,
  Layers,
  Webhook,
  Search,
  Lock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

const DeveloperSupport = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("documentation");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize form with validation
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate successful submission - actual implementation will integrate with Supabase
      setTimeout(() => {
        toast({
          title: "Ticket submitted successfully",
          description: "We'll get back to you as soon as possible",
          variant: "default",
        });
        
        // Reset form
        form.reset();
        setIsSubmitting(false);
      }, 500); // Reduced timeout for better performance
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Failed to submit ticket",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-4 md:p-6 pt-16 pb-16">
        {/* Header without breadcrumb navigation */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Developer Support</h2>
          <p className="mt-2 text-muted-foreground">Get help with your development needs</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search documentation and FAQs..." 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="support">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Developer Documentation</CardTitle>
                <CardDescription>
                  Comprehensive guides and resources for platform developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="getting-started" className="w-full">
                  <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
                    <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                    <TabsTrigger value="api-docs">API Reference</TabsTrigger>
                    <TabsTrigger value="agents">Agent Development</TabsTrigger>
                    <TabsTrigger value="deployment">Deployment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="getting-started" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3 className="text-xl font-semibold">Platform Overview</h3>
                      <p>
                        Our platform provides powerful tools for creating, managing, and deploying AI agents. This documentation
                        will help you get started with development and make the most of our features.
                      </p>

                      <h4 className="font-medium mt-6">Quick Start Guide</h4>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>
                          <strong>Create a developer account</strong> - Sign up and verify your email to get started.
                        </li>
                        <li>
                          <strong>Set up your development environment</strong> - Install our SDK and required dependencies.
                        </li>
                        <li>
                          <strong>Create your first agent</strong> - Use our wizard to create and configure a basic agent.
                        </li>
                        <li>
                          <strong>Test your agent</strong> - Use our testing tools to ensure your agent works as expected.
                        </li>
                        <li>
                          <strong>Deploy your agent</strong> - Publish your agent to make it available to users.
                        </li>
                      </ol>

                      <h4 className="font-medium mt-6">System Requirements</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                        <li>Node.js 14.0 or higher (for local development)</li>
                        <li>NPM 6.0 or higher (for package management)</li>
                        <li>Git (for version control)</li>
                      </ul>

                      <div className="bg-muted p-4 rounded-md mt-6">
                        <h5 className="font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                          Important Notes
                        </h5>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                          <li>All API requests are rate-limited to ensure platform stability</li>
                          <li>Free tier accounts have usage limitations</li>
                          <li>Keep your API keys secure and never expose them in client-side code</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="api-docs" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3 className="text-xl font-semibold">API Reference</h3>
                      <p>
                        Our RESTful API allows you to programmatically create, manage, and interact with AI agents.
                        Below you'll find comprehensive documentation for all available endpoints.
                      </p>

                      <h4 className="font-medium mt-6">Authentication</h4>
                      <p>
                        All API requests require authentication using API keys. Include your API key in the 
                        <code className="px-1 py-0.5 bg-muted rounded">Authorization</code> header as a Bearer token:
                      </p>
                      <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        Authorization: Bearer YOUR_API_KEY
                      </pre>

                      <h4 className="font-medium mt-6">Agents API</h4>
                      <div className="space-y-4 mt-4">
                        <div className="border rounded-md overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/50">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">POST</Badge>
                              <code>/api/v1/agents</code>
                            </div>
                            <span className="text-sm text-muted-foreground">Create an agent</span>
                          </div>
                          <div className="p-3 text-sm">
                            Create a new AI agent with the specified configuration.
                          </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/50">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">GET</Badge>
                              <code>/api/v1/agents</code>
                            </div>
                            <span className="text-sm text-muted-foreground">List all agents</span>
                          </div>
                          <div className="p-3 text-sm">
                            Retrieve a list of all agents associated with your account.
                          </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/50">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">GET</Badge>
                              <code>/api/v1/agents/{'{agent_id}'}</code>
                            </div>
                            <span className="text-sm text-muted-foreground">Get agent details</span>
                          </div>
                          <div className="p-3 text-sm">
                            Retrieve detailed information about a specific agent.
                          </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/50">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">PUT</Badge>
                              <code>/api/v1/agents/{'{agent_id}'}</code>
                            </div>
                            <span className="text-sm text-muted-foreground">Update agent</span>
                          </div>
                          <div className="p-3 text-sm">
                            Update an existing agent's configuration.
                          </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/50">
                            <div className="flex items-center">
                              <Badge variant="destructive" className="mr-2">DELETE</Badge>
                              <code>/api/v1/agents/{'{agent_id}'}</code>
                            </div>
                            <span className="text-sm text-muted-foreground">Delete agent</span>
                          </div>
                          <div className="p-3 text-sm">
                            Delete an agent from your account.
                          </div>
                        </div>
                      </div>

                      <h4 className="font-medium mt-6">Rate Limits</h4>
                      <p>
                        To ensure platform stability, API requests are subject to rate limiting:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Free tier: 60 requests per minute</li>
                        <li>Pro tier: 300 requests per minute</li>
                        <li>Enterprise tier: Custom limits</li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="agents" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3 className="text-xl font-semibold">Agent Development Guide</h3>
                      <p>
                        Learn how to create advanced AI agents with our comprehensive development guide.
                      </p>

                      <h4 className="font-medium mt-6">Agent Architecture</h4>
                      <p>
                        Our agent architecture consists of the following components:
                      </p>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Layers className="h-5 w-5 mr-2 text-primary" />
                            <h5 className="font-medium">Knowledge Base</h5>
                          </div>
                          <p className="text-sm">
                            Store and organize information that your agent can access and use to respond to queries.
                          </p>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Code className="h-5 w-5 mr-2 text-primary" />
                            <h5 className="font-medium">Skills</h5>
                          </div>
                          <p className="text-sm">
                            Define specific capabilities that your agent can perform, such as answering questions or performing tasks.
                          </p>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Webhook className="h-5 w-5 mr-2 text-primary" />
                            <h5 className="font-medium">Integrations</h5>
                          </div>
                          <p className="text-sm">
                            Connect your agent to external services and APIs to extend its functionality.
                          </p>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Database className="h-5 w-5 mr-2 text-primary" />
                            <h5 className="font-medium">Memory</h5>
                          </div>
                          <p className="text-sm">
                            Enable your agent to remember conversation context and user preferences.
                          </p>
                        </div>
                      </div>

                      <h4 className="font-medium mt-6">Best Practices</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          <strong>Test thoroughly</strong> - Use our testing tools to validate your agent's responses in various scenarios.
                        </li>
                        <li>
                          <strong>Keep it focused</strong> - Design agents with specific use cases in mind rather than trying to do everything.
                        </li>
                        <li>
                          <strong>Prioritize security</strong> - Never store sensitive information in your agent's knowledge base.
                        </li>
                        <li>
                          <strong>Optimize performance</strong> - Structure your agent's knowledge for efficient retrieval.
                        </li>
                        <li>
                          <strong>Handle errors gracefully</strong> - Implement fallback responses for when your agent can't fulfill a request.
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="deployment" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3 className="text-xl font-semibold">Deployment Guide</h3>
                      <p>
                        Learn how to deploy your AI agents to make them available to users.
                      </p>

                      <h4 className="font-medium mt-6">Deployment Options</h4>
                      <div className="mt-4 space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Server className="h-5 w-5 mr-2 text-primary" />
                            <h5 className="font-medium">Platform Hosting</h5>
                          </div>
                          <p className="text-sm mb-2">
                            Deploy your agent directly on our platform for the simplest integration.
                          </p>
                          <ol className="list-decimal pl-6 text-sm space-y-1">
                            <li>Go to the Agent Management dashboard</li>
                            <li>Select the agent you want to deploy</li>
                            <li>Click "Deploy" and follow the prompts</li>
                            <li>Once deployed, your agent will be available via our API</li>
                          </ol>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Code className="h-5 w-5 mr-2 text-primary" />
                            <h5 className="font-medium">API Integration</h5>
                          </div>
                          <p className="text-sm mb-2">
                            Integrate your agent with your own applications using our REST API.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                            <code>
                              POST /api/v1/agents/{'{agent_id}'}/query<br/>
                              {'{<br/>  "query": "What is the weather today?",<br/>  "user_id": "user_123"<br/>}'}
                            </code>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <Lock className="h-5 w-5 mr-2 text-primary" />
                            <h5 className="font-medium">Security Considerations</h5>
                          </div>
                          <ul className="list-disc pl-6 text-sm space-y-1">
                            <li>Use environment variables to store API keys</li>
                            <li>Implement proper authentication for your agent's endpoints</li>
                            <li>Set up CORS policies to restrict access to trusted domains</li>
                            <li>Regularly rotate API keys and review access logs</li>
                          </ul>
                        </div>
                      </div>

                      <h4 className="font-medium mt-6">Continuous Deployment</h4>
                      <p>
                        Our platform supports continuous deployment workflows:
                      </p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>
                          <strong>Version control</strong> - Each deployment creates a new version of your agent.
                        </li>
                        <li>
                          <strong>Rollback support</strong> - Easily revert to previous versions if issues are detected.
                        </li>
                        <li>
                          <strong>A/B testing</strong> - Deploy multiple versions of your agent to test changes with a subset of users.
                        </li>
                        <li>
                          <strong>Performance monitoring</strong> - Track response times and error rates to identify issues.
                        </li>
                      </ol>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="prose dark:prose-invert max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileQuestion className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No FAQs match your search. Try different keywords or browse all FAQs by clearing your search.</p>
                    </div>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card className="p-6 md:p-8 bg-card shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Contact Support</h3>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What is your issue about?" 
                            className="w-full bg-background border-input h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <select
                            className="w-full bg-background border border-input rounded-md h-12 px-3"
                            {...field}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your issue in detail..." 
                            rows={5}
                            className="w-full bg-background border-input min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 opacity-0">Submit</span>
                        <svg 
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// FAQ data
const faqs = [
  {
    question: "How do I create my first AI agent?",
    answer: `
      <p>Creating your first AI agent is easy:</p>
      <ol>
        <li>Navigate to the Agent Management section from your Developer Dashboard</li>
        <li>Click the "Create New Agent" button</li>
        <li>Follow the step-by-step wizard to configure your agent's capabilities</li>
        <li>Test your agent in the sandbox environment</li>
        <li>Deploy your agent when you're satisfied with its performance</li>
      </ol>
      <p>For more detailed instructions, refer to our <a href="#" class="text-primary hover:underline">Getting Started Guide</a>.</p>
    `
  },
  {
    question: "What's the difference between the free and paid plans?",
    answer: `
      <p>Our plans differ in several key aspects:</p>
      <ul>
        <li><strong>Free Plan:</strong> Limited to 1,000 API calls per month, basic analytics, and up to 3 agents.</li>
        <li><strong>Pro Plan ($49/month):</strong> 50,000 API calls per month, advanced analytics, priority support, and unlimited agents.</li>
        <li><strong>Enterprise Plan:</strong> Custom API call limits, dedicated support, SLA guarantees, and advanced security features.</li>
      </ul>
      <p>You can upgrade or downgrade your plan at any time from the Billing section in your account settings.</p>
    `
  },
  {
    question: "How do I integrate my agent with my own application?",
    answer: `
      <p>To integrate your agent with your application:</p>
      <ol>
        <li>Deploy your agent from the Agent Management dashboard</li>
        <li>Generate an API key from the API & Integrations section</li>
        <li>Use our RESTful API to communicate with your agent</li>
        <li>Send requests to the agent endpoint with your API key in the Authorization header</li>
      </ol>
      <p>We provide SDKs for popular programming languages to make integration easier:</p>
      <ul>
        <li>JavaScript/TypeScript</li>
        <li>Python</li>
        <li>Java</li>
        <li>Ruby</li>
      </ul>
      <p>Check our <a href="#" class="text-primary hover:underline">API Documentation</a> for detailed implementation examples.</p>
    `
  },
  {
    question: "How are API calls counted?",
    answer: `
      <p>API calls are counted as follows:</p>
      <ul>
        <li>Each request to the <code>/query</code> endpoint counts as one API call</li>
        <li>Batch operations count as multiple API calls based on the number of items processed</li>
        <li>Training or fine-tuning your agent counts as multiple API calls depending on the amount of data processed</li>
      </ul>
      <p>Your current usage and remaining API calls are visible in the Analytics dashboard. If you're approaching your limit, you'll receive email notifications at 80% and 95% of your monthly quota.</p>
    `
  },
  {
    question: "What happens if I exceed my API call limit?",
    answer: `
      <p>If you exceed your monthly API call limit:</p>
      <ul>
        <li><strong>Free Plan:</strong> Your agents will stop processing requests until the next billing cycle</li>
        <li><strong>Paid Plans:</strong> You'll be charged for additional API calls at the rate specified in your plan details</li>
      </ul>
      <p>You can set up usage alerts and automatic plan upgrades in your account settings to prevent service interruptions.</p>
    `
  },
  {
    question: "How can I improve my agent's performance?",
    answer: `
      <p>To improve your agent's performance:</p>
      <ol>
        <li><strong>Provide quality training data:</strong> The more relevant examples you provide, the better your agent will perform</li>
        <li><strong>Use feedback loops:</strong> Implement a feedback mechanism to collect user input on responses</li>
        <li><strong>Analyze error patterns:</strong> Use the Analytics dashboard to identify common failure modes</li>
        <li><strong>Implement fallback strategies:</strong> Configure your agent to handle edge cases gracefully</li>
        <li><strong>Regular updates:</strong> Keep your agent's knowledge base up to date</li>
      </ol>
      <p>Our <a href="#" class="text-primary hover:underline">Performance Optimization Guide</a> contains detailed strategies and best practices.</p>
    `
  },
  {
    question: "Is my data secure?",
    answer: `
      <p>We take data security seriously:</p>
      <ul>
        <li>All data is encrypted in transit using TLS 1.3</li>
        <li>Sensitive data is encrypted at rest using AES-256</li>
        <li>We implement strict access controls for our staff</li>
        <li>Regular security audits and penetration testing</li>
        <li>Compliance with GDPR, CCPA, and other relevant regulations</li>
      </ul>
      <p>You can review our <a href="#" class="text-primary hover:underline">Security Whitepaper</a> for detailed information about our security practices.</p>
    `
  },
  {
    question: "Can I export my agent to use elsewhere?",
    answer: `
      <p>Yes, you can export your agent configurations:</p>
      <ol>
        <li>Navigate to the Agent Management dashboard</li>
        <li>Select the agent you want to export</li>
        <li>Click the "Export" button in the action menu</li>
        <li>Choose between JSON, YAML, or our proprietary format</li>
      </ol>
      <p>Note that while you can export configurations, certain platform-specific optimizations may not transfer to other environments. Our <a href="#" class="text-primary hover:underline">Migration Guide</a> provides detailed information on compatibility considerations.</p>
    `
  },
  {
    question: "How do I handle user authentication for my agent?",
    answer: `
      <p>There are several ways to handle user authentication:</p>
      <ol>
        <li><strong>API Key Authentication:</strong> Generate and manage API keys for each of your users</li>
        <li><strong>OAuth Integration:</strong> Use our OAuth endpoints to authenticate users from your application</li>
        <li><strong>JWT Authentication:</strong> Pass JWTs in the Authorization header for stateless authentication</li>
        <li><strong>Session-based Authentication:</strong> Use our session management API for web applications</li>
      </ol>
      <p>Our platform also supports Single Sign-On (SSO) for enterprise customers. Check our <a href="#" class="text-primary hover:underline">Authentication Guide</a> for implementation details.</p>
    `
  },
  {
    question: "What support options are available?",
    answer: `
      <p>We offer multiple support channels:</p>
      <ul>
        <li><strong>Documentation:</strong> Comprehensive guides, tutorials, and API reference</li>
        <li><strong>Community Forum:</strong> Connect with other developers and share knowledge</li>
        <li><strong>Email Support:</strong> Available for all customers with varying response times based on plan</li>
        <li><strong>Live Chat:</strong> Available for Pro and Enterprise customers during business hours</li>
        <li><strong>Phone Support:</strong> Available for Enterprise customers</li>
        <li><strong>Dedicated Account Manager:</strong> Available for Enterprise customers</li>
      </ul>
      <p>You can access all support options from the Support tab in your dashboard.</p>
    `
  }
];

export default DeveloperSupport;
