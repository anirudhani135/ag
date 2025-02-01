import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";

const AgentManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Agent Management</h2>
        <Card className="p-6">
          <p>Agent management interface coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;