import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Copy, Edit, ExternalLink, Save, Share2, ShieldCheck, TestTube2, Trash2, User2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";
import { BasicInfoFormData, ConfigFormData, TestCase } from "@/types/agent-creation";
// Import the ProgressCircle from our new file instead of the non-existent import
import { ProgressCircle } from "@/components/ui/progress-circle";

interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string | null;
  developer_id: string;
  status: string | null;
  api_endpoint: string | null;
  api_key: string | null;
  runtime_config: Json | null;
  features: Json | null;
  changelog: string | null;
  documentation_url: string | null;
  demo_url: string | null;
  integration_guide: string | null;
  technical_requirements: Json | null;
  comparison_data: Json | null;
  test_results: Json | null;
  version_number: string | null;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine((value) => {
    try {
      const num = parseFloat(value);
      return !isNaN(num);
    } catch (e) {
      return false;
    }
  }, {
    message: "Price must be a valid number.",
  }),
});

const AgentDetailView = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    title: '',
    description: '',
    price: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (!agentId) {
      toast({
        title: "Error",
        description: "Agent ID is missing.",
        variant: "destructive"
      });
      return;
    }

    const fetchAgent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', agentId)
          .single();

        if (error) {
          console.error('Error fetching agent:', error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data) {
          setAgent(data);
          setFormData({
            title: data.title,
            description: data.description,
            price: data.price.toString(),
          });
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
        toast({
          title: "Error",
          description: "Failed to load agent details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
    fetchTestCases();
  }, [agentId]);

  const fetchTestCases = async () => {
    if (!agentId) return;

    try {
      // Test cases should be fetched from agent_versions, not directly from agents
      const { data: versionData, error: versionError } = await supabase
        .from('agent_versions')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (versionError) {
        console.error('Error fetching agent version:', versionError);
        return;
      }

      if (versionData && versionData.length > 0 && versionData[0].test_cases) {
        // Properly type the test cases from the version data
        setTestCases(versionData[0].test_cases as TestCase[]);
      }
    } catch (error) {
      console.error('Error in fetchTestCases:', error);
    }
  };

  useEffect(() => {
    if (agent) {
      setFormData({
        title: agent.title,
        description: agent.description,
        price: agent.price.toString(),
      });
    }
  }, [agent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateAgent = async () => {
    if (!agentId) return;

    // Remove test_cases from the agent update
    const agentUpdate = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
    };

    const { error } = await supabase
      .from('agents')
      .update(agentUpdate)
      .eq('id', agentId);

    if (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Agent updated",
      description: "Agent details have been updated successfully.",
    });

    setIsEditMode(false);
  };

  const handleDeleteAgent = async () => {
    if (!agentId) return;

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) {
        console.error('Error deleting agent:', error);
        toast({
          title: "Deletion failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Agent deleted",
        description: "Agent has been deleted successfully.",
      });

      navigate('/agents');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete agent.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Loading agent details...</div>;
  }

  if (!agent) {
    return <div>Agent not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{agent.title}</h1>
        <div>
          {isEditMode ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditMode(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleUpdateAgent}>Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditMode(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Agent
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-semibold">{agent.title}</CardTitle>
          <CardDescription className="text-gray-500">{agent.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Agent Information</h3>
              {isEditMode ? (
                <>
                  <div className="mb-4">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Price:</strong> ${agent.price}</p>
                  <p><strong>Category:</strong> {agent.category_id || 'N/A'}</p>
                  <p><strong>Status:</strong> {agent.status || 'N/A'}</p>
                </>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Details</h3>
              <p><strong>API Endpoint:</strong> {agent.api_endpoint || 'N/A'}</p>
              <p><strong>API Key:</strong> {agent.api_key ? 'Configured' : 'N/A'}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Runtime Configuration</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {JSON.stringify(agent.runtime_config, null, 2)}
            </pre>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Test Cases</h3>
            {testCases && testCases.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>Expected Output</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell>{testCase.name}</TableCell>
                      <TableCell>{testCase.input}</TableCell>
                      <TableCell>{testCase.expectedOutput}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No test cases available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="mt-8">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Agent
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the agent from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" onClick={handleDeleteAgent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentDetailView;
