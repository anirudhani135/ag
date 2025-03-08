
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  BasicInfoFormData, 
  ConfigFormData, 
  TestCase 
} from "@/types/agent-creation";
import { IntegrationFormData } from "@/components/agent-creation/integration/types";

export function useAgentCreation() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState<{ id: string } | null>(null);
  
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
    { id: "deployment", title: "Deployment", isCompleted: false },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserDetails({ id: user.id });
      } else {
        // Development mode - don't redirect
        setUserDetails({ id: "dev-user-id" });
      }
    };
    
    fetchUserDetails();
  }, [navigate, toast]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      const updatedSteps = [...steps];
      updatedSteps[currentStep] = { ...updatedSteps[currentStep], isCompleted: true };
      
      if (currentStep === steps.length - 1) {
        await handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
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

  const prepareAgentData = (status: 'draft' | 'pending_review') => {
    if (!userDetails?.id) {
      throw new Error("User not authenticated");
    }
    
    return {
      title: basicInfo.title,
      description: basicInfo.description,
      category_id: basicInfo.category,
      price: parseFloat(basicInfo.price) || 0,
      status,
      features: basicInfo.tags,
      developer_id: userDetails.id,
      runtime_config: JSON.parse(JSON.stringify(configData)),
      technical_requirements: JSON.parse(JSON.stringify({
        integration: integrationData
      })),
      test_results: JSON.parse(JSON.stringify(testCases))
    };
  };

  const handleSaveDraft = async () => {
    if (!userDetails?.id) {
      toast({
        title: "Development mode",
        description: "Saving draft in development mode",
        variant: "default",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const agentData = prepareAgentData('draft');

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
    if (!userDetails?.id) {
      toast({
        title: "Development mode",
        description: "Submitting agent in development mode",
        variant: "default",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const agentData = prepareAgentData('pending_review');

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
      case 4:
        return true; // Deployment step can always proceed
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

  return {
    currentStep,
    steps,
    basicInfo,
    setBasicInfo,
    configData,
    integrationData,
    testCases,
    isSaving,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleSaveDraft,
    handleSubmit,
    canProceed,
    handleConfigurationSave,
    handleIntegrationSave,
    handleTestCasesSave
  };
}
