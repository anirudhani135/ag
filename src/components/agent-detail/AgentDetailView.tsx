
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, AlertCircle, PlayIcon, Save, ExternalLink, BookOpen, Code, Globe, Settings, Activity, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import ReviewForm from '@/components/reviews/ReviewForm';
import { TestCase } from '@/types/agent-creation';

export const AgentDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [agentData, setAgentData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAgentDetails();
      fetchTestCases();
      fetchReviews();
      fetchVersions();
    }
  }, [id]);

  const fetchAgentDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setAgentData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agent details',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const fetchTestCases = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('test_results')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.test_results && Array.isArray(data.test_results)) {
        // Transform test_results to match TestCase type
        const transformedTestCases: TestCase[] = data.test_results.map((testCase: any) => {
          // Ensure all required fields are present
          return {
            id: testCase.id || crypto.randomUUID(),
            name: testCase.name || `Test Case ${Math.random().toString(36).substring(7)}`,
            input: testCase.input || '',
            expectedOutput: testCase.expectedOutput || '',
            actualOutput: testCase.actualOutput || '',
            // Map status to valid TestCase status values
            status: mapStatusToValidValue(testCase.status || '')
          };
        });

        setTestCases(transformedTestCases);
        
        if (transformedTestCases.length > 0) {
          setSelectedTestCase(transformedTestCases[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching test cases:', error);
      toast({
        title: 'Error',
        description: 'Failed to load test cases',
        variant: 'destructive',
      });
    }
  };

  // Function to map any status string to a valid TestCase status
  const mapStatusToValidValue = (status: string): TestCase['status'] => {
    if (status === 'success' || status === 'passed') return 'success';
    if (status === 'failure' || status === 'failed') return 'failure';
    if (status === 'running') return 'pending';
    return 'pending'; // Default fallback
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('agent_id', id);

      if (error) throw error;
      setReviews(data);

      // Calculate average rating
      if (data.length > 0) {
        const sum = data.reduce((acc: number, review: any) => {
          // Handle potential non-numeric ratings
          const reviewRating = typeof review.rating === 'string' 
            ? parseFloat(review.rating) 
            : review.rating;
            
          return acc + (isNaN(reviewRating) ? 0 : reviewRating);
        }, 0);
        setAverageRating(sum / data.length);
        setReviewCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_versions')
        .select('*')
        .eq('agent_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);

      if (data && data.length > 0) {
        setCurrentVersion(data[0].version);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: crypto.randomUUID(),
      name: `Test Case ${testCases.length + 1}`,
      input: '',
      expectedOutput: '',
      status: 'pending'
    };

    setTestCases([...testCases, newTestCase]);
    setSelectedTestCase(newTestCase.id);
  };

  const updateTestCase = (id: string, updates: Partial<TestCase>) => {
    const updatedTestCases = testCases.map(tc => 
      tc.id === id ? { ...tc, ...updates } : tc
    );
    setTestCases(updatedTestCases);
  };

  const deleteTestCase = (id: string) => {
    if (testCases.length <= 1) {
      toast({
        title: 'Cannot delete',
        description: 'You must have at least one test case',
        variant: 'destructive',
      });
      return;
    }

    const updatedTestCases = testCases.filter(tc => tc.id !== id);
    setTestCases(updatedTestCases);

    if (selectedTestCase === id) {
      setSelectedTestCase(updatedTestCases[0]?.id || null);
    }
  };

  const runTestCase = (id: string) => {
    setIsRunningTest(true);
    const testCase = testCases.find(tc => tc.id === id);

    if (!testCase) return;

    // Simulate test execution
    setTimeout(() => {
      const mockOutput = `I'm a simulated response to "${testCase.input}". This would be the agent's actual response in production.`;
      const success = !testCase.expectedOutput || testCase.expectedOutput.trim() === '' ||
        mockOutput.includes(testCase.expectedOutput);

      updateTestCase(id, {
        actualOutput: mockOutput,
        status: success ? 'success' : 'failure'
      });

      setIsRunningTest(false);

      toast({
        title: success ? 'Test passed' : 'Test failed',
        description: success ? 'The test case executed successfully.' : 'The test output didn\'t match expectations.',
        variant: success ? 'default' : 'destructive',
      });
    }, 1500);
  };

  const saveTestCases = async () => {
    try {
      // Convert TestCase[] to Json compatible format
      const jsonTestCases = testCases.map(tc => ({
        id: tc.id,
        name: tc.name,
        input: tc.input,
        expectedOutput: tc.expectedOutput || '',
        actualOutput: tc.actualOutput || '',
        status: tc.status || 'pending'
      }));

      const { error } = await supabase
        .from('agents')
        .update({ test_results: jsonTestCases })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Test cases saved',
        description: 'Your test cases have been saved successfully',
      });
    } catch (error) {
      console.error('Error saving test cases:', error);
      toast({
        title: 'Error',
        description: 'Failed to save test cases',
        variant: 'destructive',
      });
    }
  };

  const deployAgent = () => {
    setIsDeploying(true);
    setDeploymentProgress(0);
    setDeploymentStatus('deploying');
    setDeploymentLogs([
      'Initializing deployment process...',
      'Packaging agent configuration...'
    ]);

    // Simulate deployment process
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setDeploymentStatus('active');
          setDeploymentLogs(prevLogs => [
            ...prevLogs,
            'Finalizing deployment...',
            'Agent successfully deployed!'
          ]);
          setIsDeploying(false);
          
          // Update agent status in database
          updateAgentStatus('active');
          
          return 100;
        }

        // Add deployment logs based on progress
        if (newProgress === 30) {
          setDeploymentLogs(prevLogs => [
            ...prevLogs,
            'Validating configuration...',
            'Preparing runtime environment...'
          ]);
        } else if (newProgress === 60) {
          setDeploymentLogs(prevLogs => [
            ...prevLogs,
            'Deploying agent model...',
            'Setting up API endpoints...'
          ]);
        } else if (newProgress === 90) {
          setDeploymentLogs(prevLogs => [
            ...prevLogs,
            'Running health checks...',
            'Provisioning resources...'
          ]);
        }

        return newProgress;
      });
    }, 800);
  };

  const updateAgentStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating agent status:', error);
    }
  };

  const createNewVersion = async () => {
    try {
      // Get current agent data
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();

      if (agentError) throw agentError;

      // Generate new version number
      const latestVersion = versions.length > 0 ? versions[0].version : '0.0.0';
      const versionParts = latestVersion.split('.');
      const newVersion = `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`;

      // Create new version record
      const { error } = await supabase
        .from('agent_versions')
        .insert({
          agent_id: id,
          version: newVersion,
          configuration: agentData.runtime_config,
          test_results: agentData.test_results,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: 'New version created',
        description: `Version ${newVersion} has been created`,
      });

      fetchVersions();
    } catch (error) {
      console.error('Error creating new version:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new version',
        variant: 'destructive',
      });
    }
  };

  const switchVersion = (version: string) => {
    setCurrentVersion(version);
    toast({
      title: 'Version switched',
      description: `Switched to version ${version}`,
    });
  };

  const handleReviewSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide both a rating and review text',
        variant: 'destructive',
      });
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.data.user?.id || 'anonymous', // Fallback for development
          agent_id: id,
          rating: rating,
          comment: reviewText
        });

      if (error) throw error;

      toast({
        title: 'Review submitted',
        description: 'Your review has been successfully submitted',
      });

      setReviewText('');
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
        <p className="text-muted-foreground">The requested agent could not be found.</p>
      </div>
    );
  }

  // Get the current test case
  const currentTestCase = selectedTestCase
    ? testCases.find(tc => tc.id === selectedTestCase)
    : null;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="w-full lg:w-2/3 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-secondary/10 pb-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <CardTitle className="text-2xl">{agentData.title}</CardTitle>
                  <CardDescription className="mt-1">{agentData.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={agentData.status === 'active' ? 'success' : 'default'}>
                    {agentData.status === 'active' ? 'Active' : 'Draft'}
                  </Badge>
                  <Badge variant="secondary">v{currentVersion || '1.0.0'}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="configuration">Configuration</TabsTrigger>
                  <TabsTrigger value="testing">Testing</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                  <TabsTrigger value="versions">Versions</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Agent Details</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-muted-foreground">Category</Label>
                          <p>{agentData.category_id || 'General'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Price</Label>
                          <p>${parseFloat(agentData.price).toFixed(2)} USD</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Created By</Label>
                          <p>{agentData.developer_id ? 'Developer' : 'Unknown'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(agentData.features) && agentData.features.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                        {(!agentData.features || !agentData.features.length) && (
                          <p className="text-muted-foreground text-sm">No features specified</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Technical Requirements</h3>
                    {agentData.technical_requirements ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="font-medium">API Access</p>
                            <p className="text-sm text-muted-foreground">
                              {typeof agentData.technical_requirements === 'object' && 
                               agentData.technical_requirements.integration && 
                               agentData.technical_requirements.integration.authType !== 'none' 
                                ? 'Required' 
                                : 'Not Required'}
                            </p>
                          </div>
                          <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="font-medium">External Services</p>
                            <p className="text-sm text-muted-foreground">
                              {typeof agentData.technical_requirements === 'object' && 
                               agentData.technical_requirements.integration && 
                               agentData.technical_requirements.integration.externalServices?.length 
                                ? `${agentData.technical_requirements.integration.externalServices.length} services` 
                                : 'None'}
                            </p>
                          </div>
                          <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="font-medium">Rate Limit</p>
                            <p className="text-sm text-muted-foreground">
                              {typeof agentData.technical_requirements === 'object' && 
                               agentData.technical_requirements.integration && 
                               agentData.technical_requirements.integration.enableRateLimit 
                                ? `${agentData.technical_requirements.integration.rateLimitPerMinute} requests/min` 
                                : 'Unlimited'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No technical requirements specified</p>
                    )}
                  </div>
                </TabsContent>

                {/* Configuration Tab */}
                <TabsContent value="configuration" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input 
                          id="model" 
                          value={agentData.runtime_config?.model || 'gpt-4o'} 
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input 
                          id="temperature" 
                          type="number" 
                          value={agentData.runtime_config?.temperature || 0.7} 
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxTokens">Max Tokens</Label>
                        <Input 
                          id="maxTokens" 
                          type="number" 
                          value={agentData.runtime_config?.maxTokens || 4096} 
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="systemPrompt">System Prompt</Label>
                        <Textarea 
                          id="systemPrompt"
                          className="min-h-[150px] bg-muted"
                          value={agentData.runtime_config?.systemPrompt || 'You are a helpful AI assistant.'}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-medium">Advanced Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">Logging</p>
                          <p className="text-sm text-muted-foreground">Request & response logs</p>
                        </div>
                        <Badge variant={agentData.runtime_config?.enableLogging ? "success" : "outline"}>
                          {agentData.runtime_config?.enableLogging ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">Metrics</p>
                          <p className="text-sm text-muted-foreground">Performance tracking</p>
                        </div>
                        <Badge variant={agentData.runtime_config?.enableMetrics ? "success" : "outline"}>
                          {agentData.runtime_config?.enableMetrics ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">Rate Limiting</p>
                          <p className="text-sm text-muted-foreground">Calls per minute: {agentData.runtime_config?.requestsPerMinute || "Unlimited"}</p>
                        </div>
                        <Badge variant={agentData.runtime_config?.enableRateLimiting ? "success" : "outline"}>
                          {agentData.runtime_config?.enableRateLimiting ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Testing Tab */}
                <TabsContent value="testing" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Test Cases</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={addTestCase}>
                        Add Test Case
                      </Button>
                      <Button variant="default" size="sm" onClick={saveTestCases}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Tests
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-4 md:col-span-1">
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-2">
                          {testCases.map((tc) => (
                            <div
                              key={tc.id}
                              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                                tc.id === selectedTestCase
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => setSelectedTestCase(tc.id)}
                            >
                              <div className="flex items-center truncate">
                                {tc.status === 'success' || tc.status === 'passed' && (
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                )}
                                {tc.status === 'failure' || tc.status === 'failed' && (
                                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                )}
                                {tc.status === 'pending' || tc.status === 'running' && (
                                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                                )}
                                <span className="truncate max-w-[120px]">{tc.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTestCase(tc.id);
                                }}
                                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    <div className="space-y-4 md:col-span-3">
                      {currentTestCase && (
                        <>
                          <div className="space-y-3">
                            <Label htmlFor="testName">Test Name</Label>
                            <Input
                              id="testName"
                              value={currentTestCase.name}
                              onChange={(e) =>
                                updateTestCase(currentTestCase.id, { name: e.target.value })
                              }
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="testInput">Input</Label>
                            <Textarea
                              id="testInput"
                              value={currentTestCase.input}
                              onChange={(e) =>
                                updateTestCase(currentTestCase.id, { input: e.target.value })
                              }
                              className="min-h-[80px]"
                              placeholder="Enter test input..."
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="expectedOutput">Expected Output (Optional)</Label>
                            <Textarea
                              id="expectedOutput"
                              value={currentTestCase.expectedOutput || ''}
                              onChange={(e) =>
                                updateTestCase(currentTestCase.id, { expectedOutput: e.target.value })
                              }
                              className="min-h-[80px]"
                              placeholder="Enter expected output (leave blank for any output)..."
                            />
                            <p className="text-xs text-muted-foreground">
                              Leave blank to accept any response, or enter text that should be included in the response.
                            </p>
                          </div>
                          {currentTestCase.actualOutput && (
                            <div className="space-y-3">
                              <Label htmlFor="actualOutput">Actual Output</Label>
                              <div
                                className={`p-3 rounded-md text-sm ${
                                  currentTestCase.status === 'success' || currentTestCase.status === 'passed'
                                    ? "bg-green-50 border border-green-100"
                                    : "bg-red-50 border border-red-100"
                                }`}
                              >
                                {currentTestCase.actualOutput}
                              </div>
                            </div>
                          )}
                          <div className="pt-2">
                            <Button
                              onClick={() => runTestCase(currentTestCase.id)}
                              disabled={isRunningTest}
                              className="w-full md:w-auto"
                            >
                              <PlayIcon className="h-4 w-4 mr-2" />
                              {isRunningTest ? "Running Test..." : "Run Test"}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Deployment Tab */}
                <TabsContent value="deployment" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">Deployment Status</h3>
                        <p className="text-sm text-muted-foreground">
                          Current status: <Badge variant={agentData.status === 'active' ? 'success' : 'outline'}>
                            {agentData.status === 'active' ? 'Active' : (deploymentStatus || 'Not Deployed')}
                          </Badge>
                        </p>
                      </div>
                      <Button 
                        onClick={deployAgent} 
                        disabled={isDeploying || agentData.status === 'active'} 
                        variant={agentData.status === 'active' ? 'outline' : 'default'}
                      >
                        {agentData.status === 'active' ? 'Already Deployed' : (isDeploying ? 'Deploying...' : 'Deploy Agent')}
                      </Button>
                    </div>

                    {(isDeploying || deploymentStatus) && (
                      <div className="space-y-4 mt-4 border rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Deployment Progress</Label>
                            <Badge variant="outline">{deploymentProgress}%</Badge>
                          </div>
                          <Progress value={deploymentProgress} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <Label>Deployment Logs</Label>
                          <div className="bg-secondary/10 p-3 rounded-md text-sm font-mono h-[200px] overflow-auto">
                            {deploymentLogs.map((log, index) => (
                              <div key={index} className="py-1">
                                <span className="text-muted-foreground">[{new Date().toISOString().substring(11, 19)}]</span> {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 mt-4">
                      <h3 className="text-lg font-medium">Access Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium flex items-center">
                              <Globe className="h-4 w-4 mr-2" /> API Endpoint
                            </h4>
                            <Badge variant="outline">REST API</Badge>
                          </div>
                          <div className="bg-secondary/10 p-2 rounded flex items-center justify-between">
                            <code className="text-sm truncate">https://api.example.com/v1/agents/{id}</code>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-copy"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium flex items-center">
                              <BookOpen className="h-4 w-4 mr-2" /> Documentation
                            </h4>
                            <Badge variant="outline">Developer Guide</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Access detailed documentation for integration and usage examples.
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Documentation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Versions Tab */}
                <TabsContent value="versions" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Version History</h3>
                    <Button onClick={createNewVersion}>Create New Version</Button>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {versions.length > 0 ? (
                      versions.map((version, index) => (
                        <div key={index} className="p-4 flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <h4 className="font-medium">Version {version.version}</h4>
                              {version.version === currentVersion && (
                                <Badge variant="outline" className="ml-2">Current</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Created on {new Date(version.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={version.version === currentVersion}
                              onClick={() => switchVersion(version.version)}
                            >
                              {version.version === currentVersion ? 'Active' : 'Switch to this version'}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        <p>No version history found.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Agent Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Agent Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={agentData.status === 'active' ? 'success' : 'outline'}>
                    {agentData.status === 'active' ? 'Active' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">({reviewCount})</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Version</span>
                  <span>{currentVersion || '1.0.0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Test Cases</span>
                  <span>{testCases.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price</span>
                  <span>${parseFloat(agentData.price).toFixed(2)} USD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <PlayIcon className="h-4 w-4 mr-2" /> Try Demo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="h-4 w-4 mr-2" /> View API docs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" /> Configure settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" /> View analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                            {review.user_id.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium">User {review.user_id.substring(0, 6)}</p>
                            <div className="flex items-center text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      <Separator />
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <Button variant="link" className="w-full">View all {reviews.length} reviews</Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No reviews yet.</p>
                </div>
              )}

              {/* Review Form */}
              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="rating">Your Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button className="w-full" onClick={handleReviewSubmit}>
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailView;
