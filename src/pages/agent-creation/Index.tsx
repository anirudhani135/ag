
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { AgentCreationHeader } from "@/components/agent-creation/AgentCreationHeader";
import { StepContentWrapper } from "@/components/agent-creation/StepContentWrapper";
import { NavigationActions } from "@/components/agent-creation/NavigationActions";
import { useAgentCreation } from "@/hooks/useAgentCreation";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20">
        <AgentCreationHeader />

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
              canProceed={canProceed()}
              isSaving={isSaving}
              isSubmitting={isSubmitting}
              isLastStep={isLastStep}
            />
          </WizardLayout>
        </div>
      </div>
    </div>
  );
};

export default AgentCreationPage;
