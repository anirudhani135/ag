
import { useState } from "react";
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { BasicInfoStep } from "@/components/agent-creation/BasicInfoStep";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
          <Card className="p-8 bg-white shadow-md">
            <BasicInfoStep data={basicInfo} onChange={setBasicInfo} />
          </Card>
        );
      default:
        return (
          <Card className="p-8 bg-white shadow-md text-center">
            <div className="text-muted-foreground">
              Step {currentStep + 1} content coming soon...
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Agent</h1>
          <p className="text-muted-foreground mt-2">
            Configure your AI agent's settings and capabilities
          </p>
        </div>

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

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/developer/agents")}
              className="bg-white hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </Button>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="bg-white hover:bg-gray-100 text-primary border-primary"
              >
                Save Draft
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/90 text-white px-8"
              >
                Next
              </Button>
            </div>
          </div>
        </WizardLayout>
      </div>
    </div>
  );
};

export default AgentCreationPage;
