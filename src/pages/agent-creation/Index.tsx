
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { AgentCreationHeader } from "@/components/agent-creation/AgentCreationHeader";
import { StepContentWrapper } from "@/components/agent-creation/StepContentWrapper";
import { NavigationActions } from "@/components/agent-creation/NavigationActions";
import { useAgentCreation } from "@/hooks/useAgentCreation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

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
    handleTestCasesSave
  } = useAgentCreation();

  const isLastStep = currentStep === steps.length - 1;

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen px-4">
        <div className="container mx-auto max-w-4xl">
          <AgentCreationHeader />

          <WizardLayout
            currentStep={currentStep}
            steps={steps}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
            canProceed={canProceed()}
          >
            <div className="mt-8">
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
            </div>

            <NavigationActions
              onSaveDraft={handleSaveDraft}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canProceed={canProceed()}
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
