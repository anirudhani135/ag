
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Separator } from "@/components/ui/separator";
import { ProgressCircle } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Edit,
  Save,
  Terminal,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Settings,
  FileJson,
  ChevronDown,
  Package,
  Activity,
  Calendar,
  BarChart3,
  Zap,
  Code,
  Clipboard,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { TestCase } from "@/types/agent-creation";
import { Json } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ensureValidTestCaseStatus, convertJsonToTestCases } from "@/fixes/AgentDetailViewFixer";

// Import some charts for the metrics view
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AgentDetailView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [agent, setAgent] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [editedAgent, setEditedAgent] = useState<any>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchAgentDetails();
      fetchVersionHistory();
      fetchTestCases();
      fetchLogs();
    }
  }, [id]);

  const fetchAgentDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setAgent(data);
      setEditedAgent(data);
    } catch (error) {
      console.error("Error fetching agent details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch agent details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("agent_versions")
        .select("*")
        .eq("agent_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error("Error fetching version history:", error);
    }
  };

  const fetchTestCases = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("test_cases")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      if (data?.test_cases) {
        const parsedTestCases = convertJsonToTestCases(data.test_cases);
        setTestCases(parsedTestCases);
      }
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      // Simulated logs for now - in a real app, fetch from database
      setLogs([
        "2023-07-15 12:30:45 - Agent deployed successfully",
        "2023-07-15 12:35:12 - First user interaction received",
        "2023-07-15 13:45:22 - API rate limit warning (90% of allocation)",
        "2023-07-16 08:12:33 - System prompt updated",
        "2023-07-16 10:23:51 - Integration with knowledge base completed"
      ]);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAgent(agent);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("agents")
        .update({
          title: editedAgent.title,
          description: editedAgent.description,
          price: editedAgent.price,
          category: editedAgent.category
        })
        .eq("id", id);

      if (error) throw error;
      
      setAgent(editedAgent);
      setIsEditing(false);
      
      // Also save changes as a new version
      const { error: versionError } = await supabase
        .from("agent_versions")
        .insert({
          agent_id: id,
          version_number: `${versions.length + 1}.0.0`,
          changes: "Updated agent details",
          created_by: "current-user" // In a real app, get from auth context
        });
        
      if (versionError) throw versionError;
      
      fetchVersionHistory(); // Refresh the version list
      
      toast({
        title: "Success",
        description: "Agent details updated successfully.",
      });
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent details.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAgent({
      ...editedAgent,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleRunTest = (testCase: TestCase) => {
    setIsRunningTest(true);
    
    // Find the test case index
    const testIndex = testCases.findIndex(tc => tc.id === testCase.id);
    
    if (testIndex === -1) return;
    
    // Update test status to running
    const updatedTestCases = [...testCases];
    updatedTestCases[testIndex] = {
      ...updatedTestCases[testIndex],
      status: "running"
    };
    setTestCases(updatedTestCases);
    
    // Simulate API call to test agent
    setTimeout(() => {
      const mockResponse = "This is a simulated response from the agent based on the test input.";
      const success = Math.random() > 0.3; // 70% chance of success for simulation
      
      const finalTestCases = [...updatedTestCases];
      finalTestCases[testIndex] = {
        ...finalTestCases[testIndex],
        actualOutput: mockResponse,
        status: success ? "passed" : "failed"
      };
      
      setTestCases(finalTestCases);
      
      // Save updated test cases to the database
      saveTestCases(finalTestCases);
      
      setIsRunningTest(false);
      
      toast({
        title: success ? "Test passed" : "Test failed",
        description: success ? "The test completed successfully." : "The test did not meet the expected output criteria.",
        variant: success ? "default" : "destructive",
      });
    }, 2000);
  };

  const saveTestCases = async (updatedTestCases: TestCase[]) => {
    try {
      const { error } = await supabase
        .from("agents")
        .update({
          test_cases: updatedTestCases
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving test cases:", error);
      toast({
        title: "Error",
        description: "Failed to save test results.",
        variant: "destructive",
      });
    }
  };

  const handleRunAllTests = () => {
    if (testCases.length === 0) {
      toast({
        title: "No tests to run",
        description: "There are no test cases available.",
      });
      return;
    }
    
    setIsRunningTest(true);
    
    // Mark all tests as running
    const runningTestCases = testCases.map(tc => ({
      ...tc,
      status: "running" as const
    }));
    
    setTestCases(runningTestCases);
    
    // Simulate running tests one by one
    let currentIndex = 0;
    const runNextTest = () => {
      if (currentIndex >= testCases.length) {
        setIsRunningTest(false);
        return;
      }
      
      setTimeout(() => {
        const mockResponse = "This is a simulated response from the agent based on the test input.";
        const success = Math.random() > 0.3; // 70% chance of success for simulation
        
        const updatedTestCases = [...testCases];
        updatedTestCases[currentIndex] = {
          ...updatedTestCases[currentIndex],
          actualOutput: mockResponse,
          status: success ? "passed" : "failed"
        };
        
        setTestCases(updatedTestCases);
        currentIndex++;
        runNextTest();
      }, 1000);
    };
    
    runNextTest();
  };

  const handleAddTestCase = () => {
    const newTestCase: TestCase = {
      id: crypto.randomUUID(),
      name: `Test Case ${testCases.length + 1}`,
      input: "",
      expectedOutput: "",
      status: "pending"
    };
    
    const updatedTestCases = [...testCases, newTestCase];
    setTestCases(updatedTestCases);
    saveTestCases(updatedTestCases);
  };

  const getStatusIcon = (status: string) => {
    if (status === "passed" || status === "success") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === "failed" || status === "failure") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else if (status === "running") {
      return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getDeploymentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "deploying":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RefreshCw className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Agent not found or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{agent.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              className={`px-2 py-1 ${getDeploymentStatusColor(agent.deployment_status)}`}
            >
              {agent.deployment_status || "Inactive"}
            </Badge>
            <Badge variant="outline" className="px-2 py-1">
              {agent.category}
            </Badge>
            <Badge variant="secondary" className="px-2 py-1">
              ${agent.price.toFixed(2)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the agent
                  and all associated data including deployment, versions, and test cases.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Agent Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" /> Test Agent
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" /> Edit Configuration
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Terminal className="mr-2 h-4 w-4" /> View Logs
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" /> Export Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 sm:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Agent Details
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleEdit}
                    className="ml-auto"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      name="title"
                      value={editedAgent.title}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      name="description"
                      value={editedAgent.description}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <Input
                      name="price"
                      type="number"
                      value={editedAgent.price}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      name="category"
                      value={editedAgent.category}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{agent.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="mt-1">{agent.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Price</h3>
                      <p className="mt-1">${agent.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Created</h3>
                      <p className="mt-1">{new Date(agent.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                      <p className="mt-1">{new Date(agent.updated_at || agent.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Model</h3>
                    <p className="mt-1">{agent.config?.model || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Temperature</h3>
                    <p className="mt-1">{agent.config?.temperature || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Max Tokens</h3>
                    <p className="mt-1">{agent.config?.maxTokens || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">System Prompt</h3>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                      <code className="whitespace-pre-wrap">{agent.config?.systemPrompt || "Not specified"}</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileJson className="mr-2 h-5 w-5" />
                  Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">API Endpoint</h3>
                    <div className="mt-1 flex items-center">
                      <code className="bg-gray-50 p-1 rounded text-sm mr-2">
                        {agent.api_endpoint || "Not deployed"}
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => {
                        navigator.clipboard.writeText(agent.api_endpoint || "");
                        toast({ title: "Copied to clipboard" });
                      }}>
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">API Key Required</h3>
                    <p className="mt-1">{agent.integration_config?.api_key_required ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Webhooks</h3>
                    <p className="mt-1">{agent.integration_config?.webhooks?.length || 0} configured</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">External Services</h3>
                    <p className="mt-1">{agent.integration_config?.external_services?.length || 0} connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Test Cases
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRunAllTests} disabled={isRunningTest}>
                    {isRunningTest ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run All Tests
                      </>
                    )}
                  </Button>
                  <Button onClick={handleAddTestCase}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Test Case
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testCases.length === 0 ? (
                <div className="text-center py-6">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-500">No test cases found.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add test cases to verify your agent's functionality.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Input</TableHead>
                        <TableHead>Expected Output</TableHead>
                        <TableHead>Actual Output</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testCases.map((testCase) => (
                        <TableRow key={testCase.id}>
                          <TableCell>
                            {getStatusIcon(testCase.status || 'pending')}
                          </TableCell>
                          <TableCell>{testCase.name}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {testCase.input}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {testCase.expectedOutput || "(Any response)"}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {testCase.actualOutput || "-"}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRunTest(testCase)}
                              disabled={isRunningTest || testCase.status === "running"}
                            >
                              {testCase.status === "running" ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agent.performance_metrics?.total_requests || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agent.performance_metrics?.avg_response_time || 0}ms
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  -5% from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agent.performance_metrics?.success_rate || 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +3% from last week
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Request Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { name: 'Mon', value: 120 },
                      { name: 'Tue', value: 160 },
                      { name: 'Wed', value: 180 },
                      { name: 'Thu', value: 170 },
                      { name: 'Fri', value: 190 },
                      { name: 'Sat', value: 110 },
                      { name: 'Sun', value: 90 },
                    ]}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Response Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: '<100ms', value: 30 },
                        { name: '100-200ms', value: 40 },
                        { name: '200-300ms', value: 20 },
                        { name: '300-500ms', value: 8 },
                        { name: '>500ms', value: 2 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {[
                        { name: '<100ms', value: 30 },
                        { name: '100-200ms', value: 40 },
                        { name: '200-300ms', value: 20 },
                        { name: '300-500ms', value: 8 },
                        { name: '>500ms', value: 2 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Versions Tab */}
        <TabsContent value="versions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <div className="text-center py-6">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-500">No version history found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {versions.map((version, index) => (
                    <div key={version.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                          {index + 1}
                        </div>
                        {index < versions.length - 1 && <div className="w-0.5 bg-gray-200 h-full mt-1"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium mr-2">Version {version.version_number}</h3>
                          <Badge variant="outline">
                            {new Date(version.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">{version.changes}</p>
                        <div className="flex text-xs text-gray-400">
                          <span>Created by {version.created_by}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Deployment and Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-2 pr-4">
                  {logs.map((log, index) => (
                    <div 
                      key={index}
                      className="p-2 bg-muted rounded-md text-sm font-mono"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDetailView;
