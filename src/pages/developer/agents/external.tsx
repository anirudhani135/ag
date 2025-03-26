
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ExternalSourceDeployment } from "@/components/developer/deployment/ExternalSourceDeployment";

const ExternalSourceDeploymentPage = () => {
  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-8 pt-16 pb-16 bg-background">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Deploy External AI Agent</h1>
          <p className="text-muted-foreground mt-2">
            Connect your external AI agent to the platform marketplace
          </p>
        </div>
        
        <ExternalSourceDeployment />
      </div>
    </DashboardLayout>
  );
};

export default ExternalSourceDeploymentPage;
