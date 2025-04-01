
import { ExternalSourceDeployment } from "@/components/developer/ExternalSourceDeployment";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const ExternalDeploymentPage = () => {
  return (
    <DashboardLayout type="developer">
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Deploy External Agent</h1>
          <p className="text-muted-foreground">
            Connect your external AI agent or service to the marketplace
          </p>
        </div>
        
        <ExternalSourceDeployment />
      </div>
    </DashboardLayout>
  );
};

export default ExternalDeploymentPage;
