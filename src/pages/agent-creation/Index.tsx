
import { useState } from "react";
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { BasicInfoStep } from "@/components/agent-creation/BasicInfoStep";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, ChevronRight, Bot } from "lucide-react";

interface BasicInfoFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  tags: string[];
}

const AgentCreationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData>({
    title: "",
    description: "",
    category: "",
    price: "",
    tags: [],
  });

  const steps = [
    { id: "basic-info", title: "Basic Info", isCompleted: false },
    { id: "configuration", title: "Configuration", isCompleted: false },
    { id: "integration", title: "Integration", isCompleted: false },
    { id: "testing", title: "Testing", isCompleted: false },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your agent configuration has been saved as a draft.",
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          basicInfo.title.trim() !== "" &&
          basicInfo.description.trim() !== "" &&
          basicInfo.category !== ""
        );
      default:
        return true;
    }
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
      default:
        return (
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
            <div className="p-6 md:p-8 text-center">
              <Bot className="h-12 w-12 mx-auto text-primary/50 mb-4" />
              <div className="text-muted-foreground">
                Step {currentStep + 1} content coming soon...
              </div>
            </div>
          </Card>
        );
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
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/developer/agents")}
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
              >
                Cancel
              </Button>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="bg-white hover:bg-primary/5 text-primary border-primary/20 shadow-sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-primary hover:bg-primary/90 text-white px-8 h-11
                    shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </WizardLayout>
        </div>
      </div>
    </div>
  );
};

export default AgentCreationPage;
