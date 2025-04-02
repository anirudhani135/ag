import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BarChart, Bot, DollarSign, Layers, Search, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DeveloperOverview = () => {
  const navigate = useNavigate();
  const [deploymentLoading, setDeploymentLoading] = useState(false);
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['developer-dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Get agents count
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, price, deployment_status')
        .eq('developer_id', user.id);
      
      if (agentsError) throw agentsError;
      
      // Get active agents count
      const activeAgents = agents?.filter(a => a.deployment_status === 'active') || [];
      
      // Calculate total revenue
      const totalRevenue = agents?.reduce((sum, agent) => sum + (agent.price || 0), 0) || 0;
      
      return {
        totalAgents: agents?.length || 0,
        activeAgents: activeAgents.length,
        totalRevenue
      };
    }
  });
  
  const handleDeployAgent = () => {
    setDeploymentLoading(true);
    setTimeout(() => {
      setDeploymentLoading(false);
      navigate('/developer/agents/external');
    }, 500);
  };
  
  return (
    <DashboardLayout type="developer">
      <div className="space-y-8 p-8 pt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Developer Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your AI agents and monitor your developer metrics
            </p>
          </div>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleDeployAgent}
            disabled={deploymentLoading}
          >
            {deploymentLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                <span>Redirecting...</span>
              </div>
            ) : (
              <>
                <Layers className="mr-2 h-4 w-4" />
                Deploy New Agent
              </>
            )}
          </Button>
        </div>
        
        {/* Deployment Guide */}
        <Alert className="bg-muted/50 border border-border">
          <Bot className="h-4 w-4" />
          <AlertTitle>Simplified Agent Deployment</AlertTitle>
          <AlertDescription>
            We've streamlined the process to deploy AI agents through our external source deployment system.
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal" 
              onClick={handleDeployAgent}
            >
              Click here to deploy your first agent.
            </Button>
          </AlertDescription>
        </Alert>
        
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Agents
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : stats?.totalAgents || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total deployed AI agents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : stats?.activeAgents || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active deployments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading 
                  ? "Loading..." 
                  : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(stats?.totalRevenue || 0)
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Gross revenue from all agents
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Deployment Methods Info */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Deployment Methods</CardTitle>
            <CardDescription>
              Three easy ways to deploy your AI agents to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="api">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="api">API Integration</TabsTrigger>
                <TabsTrigger value="langflow">LangFlow Upload</TabsTrigger>
                <TabsTrigger value="custom">Custom Integration</TabsTrigger>
              </TabsList>
              <TabsContent value="api" className="space-y-4 mt-4">
                <h3 className="text-lg font-medium">API Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your existing AI agent API to our platform. Simply provide your API endpoint and authentication details.
                </p>
                <Button onClick={handleDeployAgent} variant="outline" className="mt-2">
                  Deploy via API
                </Button>
              </TabsContent>
              <TabsContent value="langflow" className="space-y-4 mt-4">
                <h3 className="text-lg font-medium">LangFlow Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Export your LangFlow configuration as JSON and upload it to automatically deploy your agent.
                </p>
                <Button onClick={handleDeployAgent} variant="outline" className="mt-2">
                  Upload LangFlow Config
                </Button>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4 mt-4">
                <h3 className="text-lg font-medium">Custom Integration</h3>
                <p className="text-sm text-muted-foreground">
                  For complex deployments with custom requirements, use our advanced integration options.
                </p>
                <Button onClick={handleDeployAgent} variant="outline" className="mt-2">
                  Custom Deployment
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No recent deployments found</p>
                <Button onClick={handleDeployAgent} variant="outline" size="sm" className="mt-4">
                  Deploy Your First Agent
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[218px]">
                <div className="text-center">
                  <BarChart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Deploy agents to see usage metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperOverview;
