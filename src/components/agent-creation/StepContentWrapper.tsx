
import { useState } from "react";
import { Card } from "@/components/ui/card";
import BasicInfoStep from "@/components/agent-creation/BasicInfoStep";
import { ConfigurationStep } from "@/components/agent-creation/ConfigurationStep";
import { IntegrationStep } from "@/components/agent-creation/IntegrationStep";
import { TestingStep } from "@/components/agent-creation/TestingStep";
import { DeploymentConfiguration } from "@/components/agent-creation/DeploymentConfiguration";
import { 
  BasicInfoFormData, 
  ConfigFormData, 
  TestCase 
} from "@/types/agent-creation";
import { IntegrationFormData } from "@/components/agent-creation/integration/types";

interface StepContentWrapperProps {
  currentStep: number;
  basicInfo: BasicInfoFormData;
  setBasicInfo: (data: BasicInfoFormData) => void;
  configData: ConfigFormData;
  handleConfigurationSave: (data: ConfigFormData) => void;
  integrationData: IntegrationFormData;
  handleIntegrationSave: (data: IntegrationFormData) => void;
  testCases: TestCase[];
  handleTestCasesSave: (data: TestCase[]) => void;
}

export const StepContentWrapper = ({
  currentStep,
  basicInfo,
  setBasicInfo,
  configData,
  handleConfigurationSave,
  integrationData,
  handleIntegrationSave,
  testCases,
  handleTestCasesSave
}: StepContentWrapperProps) => {
  const [deploymentId, setDeploymentId] = useState<string>("");
  
  const handleDeploymentComplete = (id: string) => {
    setDeploymentId(id);
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0 w-full">
            <div className="p-4 md:p-6 space-y-4">
              <BasicInfoStep data={basicInfo} onChange={setBasicInfo} />
            </div>
          </Card>
        );
      case 1:
        return (
          <div className="w-full space-y-4">
            <ConfigurationStep onSave={handleConfigurationSave} initialData={configData} />
          </div>
        );
      case 2:
        return (
          <div className="w-full space-y-4">
            <IntegrationStep onSave={handleIntegrationSave} initialData={integrationData} />
          </div>
        );
      case 3:
        return (
          <div className="w-full space-y-4">
            <TestingStep onSave={handleTestCasesSave} initialTestCases={testCases} />
          </div>
        );
      case 4:
        return (
          <div className="w-full space-y-4">
            <DeploymentConfiguration 
              agentId="temp-agent-id-for-development" 
              onDeploymentComplete={handleDeploymentComplete} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
        {renderCurrentStep()}
      </div>
    </div>
  );
};
