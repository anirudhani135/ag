
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ExternalSourceDeployment } from "@/components/developer/deployment/ExternalSourceDeployment";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Code, Database, Globe, Info } from "lucide-react";

const DeploymentDocumentation = () => {
  return (
    <Card className="mt-8 border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Info className="h-5 w-5" />
          Deployment Guide
        </CardTitle>
        <CardDescription>
          Step-by-step instructions for deploying AI agents to the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="api">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              API Integration
            </TabsTrigger>
            <TabsTrigger value="langflow" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              LangFlow Integration
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Custom Integration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-4">
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertTitle>API Integration Method</AlertTitle>
              <AlertDescription>
                Connect your own hosted AI agent API to the marketplace
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 1: Host Your AI Agent API</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure your AI agent is accessible via a public API endpoint. Your API should:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Accept POST requests with a JSON body containing a "message" field</li>
                  <li>Return responses in a standard JSON format with an "answer" field</li>
                  <li>Be available 24/7 with minimal downtime</li>
                  <li>Have appropriate authentication mechanisms</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 2: Fill Out the Integration Form</h3>
                <p className="text-sm text-muted-foreground">
                  In the form below, provide:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Agent name, description, category, and pricing details</li>
                  <li>Your API endpoint URL (must be HTTPS)</li>
                  <li>API key or authentication token if required</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 3: Deploy and Monitor</h3>
                <p className="text-sm text-muted-foreground">
                  After submission:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Our system will verify your API endpoint is responsive</li>
                  <li>You can monitor your agent's performance in the developer dashboard</li>
                  <li>Updates to your API will automatically reflect in the deployed agent</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="langflow" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>LangFlow Integration Method</AlertTitle>
              <AlertDescription>
                Upload a LangFlow JSON configuration file to deploy your agent
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 1: Export Your LangFlow Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  From your LangFlow project:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Open your LangFlow project</li>
                  <li>Click the "Export" button to download the JSON configuration</li>
                  <li>Verify the JSON file contains all necessary components and connections</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 2: Upload Configuration and Complete Form</h3>
                <p className="text-sm text-muted-foreground">
                  In the form below:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Select "LangFlow" as your integration type</li>
                  <li>Drag and drop or select your LangFlow JSON file</li>
                  <li>Fill in agent details including name, description, and pricing</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 3: Deploy and Test</h3>
                <p className="text-sm text-muted-foreground">
                  After submission:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Our system will parse and validate your LangFlow configuration</li>
                  <li>We'll automatically deploy your agent with the configured components</li>
                  <li>You can run test cases to ensure everything is working as expected</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <Alert>
              <Code className="h-4 w-4" />
              <AlertTitle>Custom Integration Method</AlertTitle>
              <AlertDescription>
                For advanced users with custom deployment requirements
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 1: Prepare Your Integration</h3>
                <p className="text-sm text-muted-foreground">
                  For custom integrations:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Ensure your agent can communicate via standard REST or WebSocket protocols</li>
                  <li>Implement the required interface methods for agent communication</li>
                  <li>Document any special requirements or configurations</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 2: Contact Support (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  For complex deployments, our support team can assist with:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Custom integration requirements</li>
                  <li>Special infrastructure needs</li>
                  <li>Advanced configuration options</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Step 3: Complete Deployment</h3>
                <p className="text-sm text-muted-foreground">
                  Fill out the custom deployment form with:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Detailed agent information</li>
                  <li>Integration specifications and requirements</li>
                  <li>Any custom configuration parameters</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const ExternalSourceDeploymentPage = () => {
  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-8 pt-16 pb-16 bg-background">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Deploy AI Agent</h1>
          <p className="text-muted-foreground mt-2">
            Simplified process to connect and deploy AI agents to the marketplace
          </p>
        </div>
        
        <DeploymentDocumentation />
        
        <div className="mt-8">
          <ExternalSourceDeployment />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExternalSourceDeploymentPage;
