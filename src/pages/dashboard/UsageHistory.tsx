
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UsageMetrics } from "@/components/user-dashboard/usage/UsageMetrics";

const UsageHistory = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usage History</h2>
          <p className="text-muted-foreground">
            Monitor your platform usage and activity
          </p>
        </div>

        <UsageMetrics />
      </div>
    </DashboardLayout>
  );
};

export default UsageHistory;
