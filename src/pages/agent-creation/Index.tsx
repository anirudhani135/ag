
import { useState } from "react";
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { AgentCreationHeader } from "@/components/agent-creation/AgentCreationHeader";
import { StepContentWrapper } from "@/components/agent-creation/StepContentWrapper";
import { NavigationActions } from "@/components/agent-creation/NavigationActions";
import { useAgentCreation } from "@/hooks/useAgentCreation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DeploymentConfiguration } from "@/components/agent-creation/DeploymentConfiguration";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AgentCreationPage = () => {
  const {
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
    handleTestCasesSave,
    createdAgentId
  } = useAgentCreation();

  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const navigate = useNavigate();

  const isLastStep = currentStep === steps.length - 1;

  const handleDeploymentComplete = (deploymentId: string) => {
    setDeploymentComplete(true);
    toast.success("Deployment completed successfully!");
    
    // Navigate to the agent details page when deployment is complete
    if (createdAgentId) {
      navigate(`/agent-detail?id=${createdAgentId}`);
    }
  };

  return (
    <DashboardLayout type="developer">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <AgentCreationHeader />

          <WizardLayout
            currentStep={currentStep}
            steps={steps}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
            canProceed={canProceed()}
          >
            <div className="mt-8 w-full">
              {isLastStep && createdAgentId ? (
                <DeploymentConfiguration 
                  agentId={createdAgentId} 
                  onDeploymentComplete={handleDeploymentComplete}
                />
              ) : (
                <StepContentWrapper
                  currentStep={currentStep}
                  basicInfo={basicInfo}
                  setBasicInfo={setBasicInfo}
                  configData={configData}
                  handleConfigurationSave={handleConfigurationSave}
                  integrationData={integrationData}
                  handleIntegrationSave={handleIntegrationSave}
                  testCases={testCases}
                  handleTestCasesSave={handleTestCasesSave}
                />
              )}
            </div>

            <NavigationActions
              onSaveDraft={handleSaveDraft}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canProceed={isLastStep ? deploymentComplete : canProceed()}
              isSaving={isSaving}
              isSubmitting={isSubmitting}
              isLastStep={isLastStep}
            />
          </WizardLayout>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentCreationPage;
