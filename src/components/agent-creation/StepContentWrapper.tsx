
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
      case 4:
        return <DeploymentConfiguration 
                 agentId="temp-agent-id-for-development" 
                 onDeploymentComplete={handleDeploymentComplete} 
               />;
      default:
        return null;
    }
  };

  return renderCurrentStep();
};
