
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2, Settings, BarChart2, Users, DollarSign, Activity, ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";

interface RuntimeConfig {
  model?: string;
  systemPrompt?: string;
  enableLogging?: boolean;
  enableMetrics?: boolean;
  enableRateLimiting?: boolean;
}

interface AgentDetailPanelProps {
  agentId: string;
  onClose: () => void;
}

export const AgentDetailPanel = ({ agentId, onClose }: AgentDetailPanelProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { data: agent, isLoading, error } = useQuery({
    queryKey: ['agent-details', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          categories(name),
          reviews(id, rating, comment, created_at, user_id, profiles(name, avatar_url)),
          deployments(id, status, health_status, error_rate, response_time, last_health_check)
        `)
        .eq('id', agentId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: metrics } = useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status: 'pending_review' })
        .eq('id', agentId);
      
      if (error) throw error;
      
      toast.success("Agent submitted for review");
    } catch (error) {
      console.error("Error publishing agent:", error);
      toast.error("Failed to submit agent for review");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const { error } = await supabase
        .from('deployments')
        .insert({
          agent_id: agentId,
          status: 'deploying',
          health_status: 'healthy',
          deployment_status: 'deploying'
        });
      
      if (error) throw error;
      
      await supabase
        .from('agents')
        .update({ deployment_status: 'active' })
        .eq('id', agentId);
      
      toast.success("Agent deployed successfully");
    } catch (error) {
      console.error("Error deploying agent:", error);
      toast.error("Failed to deploy agent");
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'pending_review':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'healthy':
        return <Badge className="bg-green-500">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-500">Unhealthy</Badge>;
      default:
        return <Badge>{health}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6">
          <p className="text-red-500">Error loading agent details: {(error as Error).message}</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </CardContent>
      </Card>
    );
  }

  if (!agent) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6">
          <p>Agent not found</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </CardContent>
      </Card>
    );
  }

  // Parse runtime_config if it's a string
  const runtimeConfig: RuntimeConfig = typeof agent.runtime_config === 'string'
    ? JSON.parse(agent.runtime_config)
    : (agent.runtime_config as RuntimeConfig || {});

  // Parse features if it's a string
  const features: string[] = typeof agent.features === 'string'
    ? JSON.parse(agent.features)
    : (Array.isArray(agent.features) ? agent.features : []);

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl font-bold">{agent.title}</CardTitle>
            <CardDescription>{agent.description}</CardDescription>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {getStatusBadge(agent.status)}
              <Badge variant="outline">v{agent.version_number}</Badge>
              {agent.price > 0 ? (
                <Badge variant="secondary">${agent.price}</Badge>
              ) : (
                <Badge variant="outline">Free</Badge>
              )}
              {agent.categories?.name && (
                <Badge variant="outline">{agent.categories.name}</Badge>
              )}
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={onClose} className="self-end sm:self-start">
            Close
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Deployment</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.[0]?.views || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{(metrics?.[0]?.views || 0) - (metrics?.[1]?.views || 0)} from last period
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${metrics?.[0]?.revenue?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(metrics?.[0]?.revenue || 0) > (metrics?.[1]?.revenue || 0) ? (
                      <span className="text-green-500 flex items-center">
                        <ChevronUp className="h-3 w-3 mr-1" />
                        {(((metrics?.[0]?.revenue || 0) - (metrics?.[1]?.revenue || 0)) / (metrics?.[1]?.revenue || 1) * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <ChevronDown className="h-3 w-3 mr-1" />
                        {(((metrics?.[1]?.revenue || 0) - (metrics?.[0]?.revenue || 0)) / (metrics?.[1]?.revenue || 1) * 100).toFixed(1)}%
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="sm:col-span-2 md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Purchases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.[0]?.purchases || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Conversion rate: {metrics?.[0]?.conversion_rate?.toFixed(1) || 0}%
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium">Model</dt>
                    <dd className="mt-1 text-sm">
                      {runtimeConfig.model || 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium">System Prompt</dt>
                    <dd className="mt-1 text-sm border p-3 rounded-md bg-muted/50 whitespace-pre-wrap max-h-40 overflow-auto">
                      {runtimeConfig.systemPrompt || 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium">Features</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {features.length > 0 ? (
                        features.map((feature: string) => (
                          <Badge key={feature} variant="outline">{feature}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No features specified</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="views" 
                        name="Views"
                        stroke="#8884d8" 
                        strokeWidth={2} 
                        dot={false}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue ($)"
                        stroke="#82ca9d" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="conversion_rate" name="Conversion Rate (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Status</CardTitle>
                <CardDescription>
                  Current deployment status and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {agent.deployments && agent.deployments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(agent.deployment_status || 'draft')}
                          {getHealthBadge(agent.deployments[0].health_status)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Health Check</p>
                        <p className="text-sm">{new Date(agent.deployments[0].last_health_check).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4">
                        <p className="text-sm font-medium">Response Time</p>
                        <p className="text-2xl font-bold mt-1">{agent.deployments[0].response_time.toFixed(2)} ms</p>
                      </div>
                      <div className="border rounded-md p-4">
                        <p className="text-sm font-medium">Error Rate</p>
                        <p className="text-2xl font-bold mt-1">{agent.deployments[0].error_rate.toFixed(2)}%</p>
                      </div>
                      <div className="border rounded-md p-4">
                        <p className="text-sm font-medium">Uptime</p>
                        <p className="text-2xl font-bold mt-1">99.9%</p>
                      </div>
                    </div>
                    
                    {agent.deployments[0].error_rate > 5 && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">High Error Rate</p>
                            <p className="text-sm text-yellow-700 mt-1">
                              Your agent has a high error rate. Consider investigating the logs or updating the configuration.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      This agent is not yet deployed
                    </p>
                    <Button 
                      onClick={handleDeploy} 
                      disabled={isDeploying}
                      className="min-w-32"
                    >
                      {isDeploying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Deploy Agent
                    </Button>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col items-start gap-4">
                <div className="w-full">
                  <p className="text-sm font-medium mb-2">Advanced Settings</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="logging" className="flex items-center gap-2">
                        Enable Detailed Logging
                      </Label>
                      <Switch id="logging" defaultChecked={runtimeConfig.enableLogging} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="metrics" className="flex items-center gap-2">
                        Enable Performance Metrics
                      </Label>
                      <Switch id="metrics" defaultChecked={runtimeConfig.enableMetrics} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rate-limit" className="flex items-center gap-2">
                        Enable Rate Limiting
                      </Label>
                      <Switch id="rate-limit" defaultChecked={runtimeConfig.enableRateLimiting} />
                    </div>
                  </div>
                </div>
                
                <div className="w-full">
                  <Label htmlFor="deploy-notes" className="text-sm font-medium">Deployment Notes</Label>
                  <Textarea 
                    id="deploy-notes" 
                    placeholder="Add notes about this deployment" 
                    className="mt-2"
                  />
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {agent.reviews?.length || 0} reviews, {agent.rating?.toFixed(1) || '0.0'} average rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                {agent.reviews && agent.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {agent.reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {review.profiles?.name?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{review.profiles?.name || 'Anonymous'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{review.rating}</span>
                            <span className="text-yellow-400 ml-1">★</span>
                          </div>
                        </div>
                        
                        {review.comment && (
                          <p className="text-sm mt-2">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      No reviews yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
        {agent.status === 'draft' && (
          <>
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogTrigger asChild>
                <Button variant="default">Submit for Review</Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit Agent for Review</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to submit this agent for review? 
                    Once submitted, you won't be able to make changes until the review is complete.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      handlePublish();
                      setShowConfirmation(false);
                    }}
                    disabled={isPublishing}
                  >
                    {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AgentDetailPanel;
