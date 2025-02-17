
import { useState } from "react";
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { BasicInfoStep } from "@/components/agent-creation/BasicInfoStep";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
        return <BasicInfoStep data={basicInfo} onChange={setBasicInfo} />;
      default:
        return <div>Step {currentStep + 1} content coming soon...</div>;
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      steps={steps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSaveDraft={handleSaveDraft}
      canProceed={canProceed()}
    >
      {renderCurrentStep()}
    </WizardLayout>
  );
};

export default AgentCreationPage;
