
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Agents = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">My Agents</h2>
        <p className="text-muted-foreground">
          Manage and interact with your agents
        </p>
        {/* Agent list will be implemented here */}
      </div>
    </DashboardLayout>
  );
};

export default Agents;
