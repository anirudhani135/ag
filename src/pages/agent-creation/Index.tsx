
import { useState } from "react";
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { BasicInfoStep } from "@/components/agent-creation/BasicInfoStep";
import { ConfigurationStep } from "@/components/agent-creation/ConfigurationStep";
import { IntegrationStep } from "@/components/agent-creation/IntegrationStep";
import { TestingStep } from "@/components/agent-creation/TestingStep";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  ChevronRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface BasicInfoFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  tags: string[];
}

interface ConfigFormData {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  apiEndpoint?: string;
  enableLogging: boolean;
  enableMetrics: boolean;
  enableRateLimiting: boolean;
  requestsPerMinute?: number;
}

interface IntegrationFormData {
  enableWebhook: boolean;
  webhookUrl?: string;
  webhookEvents: string[];
  apiKey?: string;
  enableRateLimit: boolean;
  rateLimitPerMinute: number;
  authType: string;
  authDetails?: {
    username?: string;
    password?: string;
    token?: string;
    headerName?: string;
  };
}

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput?: string;
  actualOutput?: string;
  status?: "success" | "failure" | "pending";
}

const AgentCreationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData>({
    title: "",
    description: "",
    category: "",
    price: "",
    tags: [],
  });
  const [configData, setConfigData] = useState<ConfigFormData>({
    model: "gpt-4o",
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: "You are a helpful AI assistant.",
    enableLogging: true,
    enableMetrics: true,
    enableRateLimiting: false,
  });
  const [integrationData, setIntegrationData] = useState<IntegrationFormData>({
    enableWebhook: false,
    webhookEvents: [],
    enableRateLimit: true,
    rateLimitPerMinute: 60,
    authType: "none",
  });
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: crypto.randomUUID(), name: "Test Case 1", input: "Hello, how are you?", expectedOutput: "" }
  ]);

  const steps = [
    { id: "basic-info", title: "Basic Info", isCompleted: false },
    { id: "configuration", title: "Configuration", isCompleted: false },
    { id: "integration", title: "Integration", isCompleted: false },
    { id: "testing", title: "Testing", isCompleted: false },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      // Update progress status for the current step
      const updatedSteps = [...steps];
      updatedSteps[currentStep] = { ...updatedSteps[currentStep], isCompleted: true };
      
      // If it's the last step, submit everything
      if (currentStep === steps.length - 1) {
        await handleSubmit();
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
        
        // Show progress toast
        toast({
          title: `Step ${currentStep + 1} completed`,
          description: `Moving to ${steps[currentStep + 1].title}`,
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Prepare the data
      const agentData = {
        title: basicInfo.title,
        description: basicInfo.description,
        category_id: basicInfo.category,
        price: parseFloat(basicInfo.price) || 0,
        status: 'draft',
        features: basicInfo.tags,
        runtime_config: {
          ...configData
        },
        technical_requirements: {
          integration: integrationData
        },
        test_results: testCases
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('agents')
        .insert(agentData)
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your agent configuration has been saved as a draft.",
      });
      
      // Optional: Navigate to the agent detail page
      // navigate(`/developer/agents/${data.id}`);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description: "There was an error saving your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare the data
      const agentData = {
        title: basicInfo.title,
        description: basicInfo.description,
        category_id: basicInfo.category,
        price: parseFloat(basicInfo.price) || 0,
        status: 'pending_review',
        features: basicInfo.tags,
        runtime_config: {
          ...configData
        },
        technical_requirements: {
          integration: integrationData
        },
        test_results: testCases
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('agents')
        .insert(agentData)
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Agent submitted",
        description: "Your agent has been submitted for review.",
      });
      
      // Navigate to the agent management page
      navigate("/developer/agents");
    } catch (error) {
      console.error("Error submitting agent:", error);
      toast({
        title: "Error submitting agent",
        description: "There was an error submitting your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          basicInfo.title.trim() !== "" &&
          basicInfo.description.trim() !== "" &&
          basicInfo.category !== ""
        );
      case 1:
        return (
          configData.model !== "" &&
          configData.systemPrompt.trim() !== ""
        );
      case 2:
        return true;
      case 3:
        return testCases.length > 0;
      default:
        return true;
    }
  };

  const handleConfigurationSave = (data: ConfigFormData) => {
    setConfigData(data);
    toast({
      title: "Configuration saved",
      description: "Your agent configuration has been updated.",
    });
  };

  const handleIntegrationSave = (data: IntegrationFormData) => {
    setIntegrationData(data);
    toast({
      title: "Integration settings saved",
      description: "Your integration configuration has been updated.",
    });
  };

  const handleTestCasesSave = (data: TestCase[]) => {
    setTestCases(data);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
            <div className="p-6 md:p-8 space-y-6">
              <BasicInfoStep data={basicInfo} onChange={setBasicInfo} />
            </div>
          </Card>
        );
      case 1:
        return <ConfigurationStep onSave={handleConfigurationSave} initialData={configData} />;
      case 2:
        return <IntegrationStep onSave={handleIntegrationSave} initialData={integrationData} />;
      case 3:
        return <TestingStep onSave={handleTestCasesSave} initialTestCases={testCases} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20">
        {/* Header with improved visual hierarchy */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/developer/agents")}
              className="hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Agents
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Create New Agent
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Configure your AI agent's settings and capabilities. Follow the steps below to set up your agent.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <WizardLayout
            currentStep={currentStep}
            steps={steps}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
            canProceed={canProceed()}
          >
            <div className="mt-8">
              {renderCurrentStep()}
            </div>

            {/* Navigation buttons with improved styling */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/developer/agents")}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
              >
                Cancel
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="w-full sm:w-auto bg-white hover:bg-primary/5 text-primary border-primary/20 shadow-sm relative"
                      >
                        {isSaving ? (
                          <>
                            <span className="opacity-0">Save Draft</span>
                            <svg 
                              className="animate-spin h-5 w-5 text-primary absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
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
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save your progress to continue later</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed() || isSubmitting}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 h-11
                          shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {currentStep === steps.length - 1 ? (
                          isSubmitting ? "Submitting..." : "Submit Agent"
                        ) : (
                          <>
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currentStep === steps.length - 1 ? "Submit your agent" : "Continue to the next step"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </WizardLayout>
        </div>
      </div>
    </div>
  );
};

export default AgentCreationPage;
