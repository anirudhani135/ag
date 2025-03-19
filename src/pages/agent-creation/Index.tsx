
import { useState, useEffect } from "react";
import { WizardLayout } from "@/components/agent-creation/WizardLayout";
import { AgentCreationHeader } from "@/components/agent-creation/AgentCreationHeader";
import { StepContentWrapper } from "@/components/agent-creation/StepContentWrapper";
import { NavigationActions } from "@/components/agent-creation/NavigationActions";
import { useAgentCreation } from "@/hooks/useAgentCreation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DeploymentConfiguration } from "@/components/agent-creation/DeploymentConfiguration";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

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
  const [deploymentStarted, setDeploymentStarted] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [deploymentStatus, setDeploymentStatus] = useState("");
  const navigate = useNavigate();

  const isLastStep = currentStep === steps.length - 1;

  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDeploymentComplete = (deploymentId: string) => {
    setDeploymentComplete(true);
    toast.success("Deployment completed successfully!");
    
    // Navigate to the agent details page when deployment is complete
    if (createdAgentId) {
      setTimeout(() => {
        navigate(`/agent-detail?id=${createdAgentId}`);
      }, 1500);
    }
  };

  // Make this async to match the expected type
  const handleStartDeployment = async () => {
    if (!createdAgentId) {
      // Create a mock agent ID for development
      const mockAgentId = `dev-agent-${Date.now()}`;
      setDeploymentStatus("Deploying...");
      setDeploymentStarted(true);
      
      // Simulate deployment process
      setTimeout(() => {
        setDeploymentStatus("Deployed");
        setDeploymentComplete(true);
        toast.success("Agent deployed successfully!");
      }, 3000);
      
      return Promise.resolve();
    }
    
    setDeploymentStarted(true);
    setDeploymentStatus("Deploying...");
    
    try {
      // Call the edge function to deploy the agent
      const { data, error } = await supabase.functions.invoke('deploy-agent', {
        body: {
          agentId: createdAgentId,
          versionId: createdAgentId, // Using agent ID as version ID for simplicity
          config: {
            environment: "production",
            resources: {
              cpu: "0.5",
              memory: "512Mi",
              timeout: 30
            },
            scaling: {
              minReplicas: 1,
              maxReplicas: 3
            }
          }
        }
      });
      
      if (error) throw error;
      
      setDeploymentStatus("Deployed");
      setDeploymentComplete(true);
      toast.success("Agent deployed successfully!");
      
      // Navigate to the agent details page after successful deployment
      setTimeout(() => {
        if (createdAgentId) {
          navigate(`/agent-detail?id=${createdAgentId}`);
        }
      }, 1500);
      
    } catch (error) {
      console.error("Deployment error:", error);
      setDeploymentStatus("Failed");
      toast.error("Deployment failed. Please try again.");
    }
    
    return Promise.resolve();
  };

  if (isPageLoading) {
    return (
      <DashboardLayout type="developer">
        <div className="w-full px-4 md:px-6 lg:px-8 pt-16"> {/* Added top padding to avoid overlap */}
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-4 w-full max-w-xl mb-12" />
            <div className="flex justify-between mb-8">
              {steps.map((_, i) => (
                <Skeleton key={i} className="h-2 w-16" />
              ))}
            </div>
            <Skeleton className="h-64 w-full mb-8" />
            <div className="flex justify-end gap-2 mt-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="developer">
      <div className="w-full px-4 md:px-6 lg:px-8 pt-12"> {/* Added top padding to avoid overlap */}
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
                  status={deploymentStatus}
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
              onNext={isLastStep && !deploymentStarted ? handleStartDeployment : handleNext}
              onPrevious={handlePrevious}
              canProceed={isLastStep ? (!deploymentStarted || deploymentComplete) : canProceed()}
              isSaving={isSaving}
              isSubmitting={isSubmitting}
              isLastStep={isLastStep}
              deploymentStarted={deploymentStarted}
              deploymentComplete={deploymentComplete}
            />
          </WizardLayout>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentCreationPage;
