import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TestCase } from '@/types/agent-creation';
import { Json } from '@/integrations/supabase/types';

export const AgentDetailView = () => {
  const { id: agentId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const { data: agent, isLoading: isAgentLoading } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          categories:category_id (name),
          developer:developer_id (name, avatar_url)
        `)
        .eq('id', agentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!agentId,
  });

  const { data: deploymentStatus, isLoading: isDeploymentLoading } = useQuery({
    queryKey: ['agent-deployment', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployments')
        .select('*')
        .eq('agent_id', agentId)
        .order('deployed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!agentId,
    refetchInterval: 5000, // Polling every 5 seconds for status updates
  });

  const { data: versions, isLoading: isVersionsLoading } = useQuery({
    queryKey: ['agent-versions', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_versions')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!agentId,
  });

  const { data: reviews, isLoading: isReviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['agent-reviews', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (name, avatar_url)
        `)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!agentId,
  });

  // Fetch test cases for this agent
  useEffect(() => {
    if (agentId) {
      const fetchTestCases = async () => {
        try {
          const { data, error } = await supabase
            .from('agents')
            .select('test_results')
            .eq('id', agentId)
            .single();

          if (error) {
            console.error('Error fetching test cases:', error);
            return;
          }

          if (data && data.test_results) {
            // We need to safely transform the Json array to TestCase[]
            const testResultsArray = data.test_results as Json[];
            
            // Transform and validate the data
            const transformedTestCases: TestCase[] = testResultsArray.map((item) => {
              // If item is an object with the expected shape, convert it to TestCase
              if (
                typeof item === 'object' && 
                item !== null && 
                'id' in item && 
                'input' in item && 
                'expectedOutput' in item
              ) {
                return {
                  id: String(item.id),
                  input: String(item.input),
                  expectedOutput: String(item.expectedOutput),
                  actualOutput: 'actualOutput' in item ? String(item.actualOutput) : '',
                  status: 'status' in item ? String(item.status) : 'pending'
                };
              }
              // Otherwise, return a default TestCase object
              return {
                id: 'default-id',
                input: 'Invalid test case format',
                expectedOutput: '',
                actualOutput: '',
                status: 'error'
              };
            });

            setTestCases(transformedTestCases);
          }
        } catch (err) {
          console.error('Error processing test cases:', err);
        }
      };

      fetchTestCases();
    }
  }, [agentId]);

  const handleReviewSubmit = async () => {
    if (!agentId || !reviewText || rating === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide both a rating and review text",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      
      // Submit the review
      const { error } = await supabase
        .from('reviews')
        .insert({
          agent_id: agentId,
          user_id: user.data.user?.id || 'anonymous-user',
          rating,
          comment: reviewText,
        });

      if (error) throw error;

      // Update the agent's average rating
      if (reviews) {
        const allRatings = [...reviews.map(r => r.rating), rating];
        const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
        
        const { error: updateError } = await supabase
          .from('agents')
          .update({ 
            rating: avgRating.toFixed(1),
            reviews_count: allRatings.length
          })
          .eq('id', agentId);
          
        if (updateError) throw updateError;
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form
      setReviewText('');
      setRating(0);
      
      // Refresh reviews
      refetchReviews();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock function to run test cases
  const runTestCase = async (testCase: TestCase) => {
    // In a real implementation, this would call an API endpoint
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      // Update test case to "running" status
      const updatedTestCases = testCases.map(tc => 
        tc.id === testCase.id ? { ...tc, status: 'running' } : tc
      );
      setTestCases(updatedTestCases);
      
      // Simulate API call
      await delay(1500);
      
      // Mock result (randomly pass or fail)
      const isPassing = Math.random() > 0.3;
      const result = isPassing ? 'Expected output met' : 'Output did not match expected result';
      
      // Update test case with result
      const finalTestCases = testCases.map(tc => 
        tc.id === testCase.id 
          ? { 
              ...tc, 
              status: isPassing ? 'passed' : 'failed',
              actualOutput: result 
            } 
          : tc
      );
      setTestCases(finalTestCases);
      
      // Save results to agent
      if (agentId) {
        const { error } = await supabase
          .from('agents')
          .update({ 
            test_results: finalTestCases 
          })
          .eq('id', agentId);
          
        if (error) throw error;
      }
      
      toast({
        title: isPassing ? "Test Passed" : "Test Failed",
        description: `Test case ${testCase.id} ${isPassing ? 'passed successfully' : 'failed'}`,
        variant: isPassing ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error('Error running test case:', error);
      toast({
        title: "Error",
        description: "Failed to run test case. Please try again.",
        variant: "destructive",
      });
    }
  };

  const runAllTests = async () => {
    for (const testCase of testCases) {
      await runTestCase(testCase);
    }
  };

  if (isAgentLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-2xl font-bold">Agent Not Found</h2>
        <p className="text-muted-foreground">The agent you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const getDeploymentStatusBadge = () => {
    if (!deploymentStatus) return <Badge variant="outline">Not Deployed</Badge>;

    switch (deploymentStatus.status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'deploying':
        return <Badge className="bg-yellow-500">Deploying</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{agent.title}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <Badge variant="outline" className="text-sm">v{agent.version_number}</Badge>
            {getDeploymentStatusBadge()}
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{agent.rating}/5</span>
              <span className="text-muted-foreground ml-1">({agent.reviews_count || 0} reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Share</Button>
          <Button variant="default">Deploy</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Details</CardTitle>
                <CardDescription>Complete information about this agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{agent.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {Array.isArray(agent.features) && agent.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                    {(!Array.isArray(agent.features) || agent.features.length === 0) && (
                      <li>No features listed</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Technical Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/50 border-none">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">API Key Required</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{agent.technical_requirements?.api_key_required ? "Yes" : "No"}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50 border-none">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Pricing</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{agent.price === 0 ? "Free" : `$${agent.price}`}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Demo Environment</h3>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-muted/30 h-64 flex items-center justify-center">
                        <div className="text-center p-6">
                          <h3 className="font-medium text-xl mb-2">Try the Demo</h3>
                          <p className="text-muted-foreground mb-4">Experience this agent without deploying</p>
                          <Button>Launch Demo</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Integration Guide</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Installation</h4>
                          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                            <code>npm install @ai-agents/{agent.title.toLowerCase().replace(/\s+/g, '-')}</code>
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Quick Start</h4>
                          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                            <code>{`import { ${agent.title.replace(/\s+/g, '')} } from '@ai-agents/${agent.title.toLowerCase().replace(/\s+/g, '-')}';

const agent = new ${agent.title.replace(/\s+/g, '')}({
  apiKey: 'your-api-key',
});

const result = await agent.process('Your input here');
console.log(result);`}</code>
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
                <CardDescription>Settings and parameters for this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto whitespace-pre text-sm">
                  <code>{JSON.stringify(agent.runtime_config || {}, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Test Cases</CardTitle>
                  <CardDescription>Verify agent functionality with test cases</CardDescription>
                </div>
                <Button onClick={runAllTests} disabled={testCases.length === 0}>Run All Tests</Button>
              </CardHeader>
              <CardContent>
                {testCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No test cases available for this agent</p>
                    <Button variant="outline" className="mt-4">Add Test Case</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testCases.map(testCase => (
                      <Card key={testCase.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 p-4 flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-base">Test Case {testCase.id}</CardTitle>
                            <CardDescription>
                              Status: {' '}
                              {testCase.status === 'passed' && <Badge className="bg-green-500">Passed</Badge>}
                              {testCase.status === 'failed' && <Badge variant="destructive">Failed</Badge>}
                              {testCase.status === 'pending' && <Badge variant="outline">Not Run</Badge>}
                              {testCase.status === 'running' && (
                                <Badge className="bg-yellow-500">
                                  <span className="mr-1">Running</span>
                                  <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse"></span>
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => runTestCase(testCase)}
                            disabled={testCase.status === 'running'}
                          >
                            Run Test
                          </Button>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Input</h4>
                            <div className="bg-muted p-3 rounded-md text-sm">
                              {testCase.input}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Expected Output</h4>
                            <div className="bg-muted p-3 rounded-md text-sm">
                              {testCase.expectedOutput}
                            </div>
                          </div>
                          {testCase.actualOutput && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Actual Output</h4>
                              <div className={`p-3 rounded-md text-sm ${
                                testCase.status === 'passed' ? 'bg-green-100 dark:bg-green-900/20' :
                                testCase.status === 'failed' ? 'bg-red-100 dark:bg-red-900/20' :
                                'bg-muted'
                              }`}>
                                {testCase.actualOutput}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>Track changes across different versions</CardDescription>
              </CardHeader>
              <CardContent>
                {isVersionsLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : versions && versions.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4 pr-4">
                      {versions.map((version, index) => (
                        <Card key={version.id} className={`overflow-hidden ${
                          index === 0 ? 'border-primary' : ''
                        }`}>
                          <CardHeader className="p-4 bg-muted/30 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-base">{version.version_number}</CardTitle>
                              <CardDescription>
                                {new Date(version.created_at).toLocaleDateString()} 
                                {index === 0 && <Badge className="ml-2">Current</Badge>}
                              </CardDescription>
                            </div>
                            {index !== 0 && (
                              <Button size="sm" variant="outline">Switch to Version</Button>
                            )}
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">{version.changes || 'No change notes'}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No version history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Monitor agent performance and reliability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-muted/50 border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Response Time</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{deploymentStatus?.response_time || 0}ms</p>
                      <p className="text-xs text-muted-foreground">Avg. over last 24h</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Error Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{deploymentStatus?.error_rate || 0}%</p>
                      <p className="text-xs text-muted-foreground">Last 100 requests</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Uptime</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{deploymentStatus?.uptime_percentage || 100}%</p>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-medium">Deployment Logs</h3>
                  <p className="text-sm text-muted-foreground">Recent system messages and errors</p>
                </div>

                <div className="bg-black text-green-400 p-4 rounded-md h-[200px] font-mono text-sm overflow-auto">
                  <div className="space-y-2">
                    {deploymentStatus?.logs && Array.isArray(deploymentStatus.logs) ? 
                      deploymentStatus.logs.map((log, i) => (
                        <div key={i} className="flex">
                          <span className="opacity-50 mr-2">[{new Date().toISOString()}]</span>
                          <span>{log}</span>
                        </div>
                      )) : (
                        <>
                          <div className="flex">
                            <span className="opacity-50 mr-2">[{new Date().toISOString()}]</span>
                            <span>Agent deployment initialized</span>
                          </div>
                          <div className="flex">
                            <span className="opacity-50 mr-2">[{new Date().toISOString()}]</span>
                            <span>Loading configuration...</span>
                          </div>
                          <div className="flex">
                            <span className="opacity-50 mr-2">[{new Date().toISOString()}]</span>
                            <span>Configuration validated</span>
                          </div>
                          <div className="flex">
                            <span className="opacity-50 mr-2">[{new Date().toISOString()}]</span>
                            <span>Starting runtime environment</span>
                          </div>
                          <div className="flex">
                            <span className="opacity-50 mr-2">[{new Date().toISOString()}]</span>
                            <span>Agent deployed successfully</span>
                          </div>
                        </>
                      )
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Reviews</CardTitle>
                <CardDescription>See what others are saying about this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Card className="bg-muted/30 border-none">
                    <CardContent className="p-6">
                      <ReviewForm 
                        agentId={agentId || ''} 
                        onReviewSubmitted={handleReviewSubmit}
                        reviewText={reviewText}
                        setReviewText={setReviewText}
                        rating={rating}
                        setRating={setRating}
                      />
                    </CardContent>
                  </Card>

                  <Separator />

                  {isReviewsLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-6 pr-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-2">
                                  {review.profiles?.avatar_url ? (
                                    <img 
                                      src={review.profiles.avatar_url} 
                                      alt="User avatar" 
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    review.profiles?.name?.[0] || 'U'
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{review.profiles?.name || 'Anonymous User'}</p>
                                  <div className="flex text-yellow-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                            
                            {review.developer_reply && (
                              <div className="ml-8 mt-2 p-3 bg-muted rounded-md">
                                <p className="text-xs font-medium">Developer Response:</p>
                                <p className="text-sm">{review.developer_reply}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No reviews yet. Be the first to leave a review!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
