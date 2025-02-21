
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardOverview } from "@/components/user-dashboard/DashboardOverview";

const Overview = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Monitor your agent activity and manage your account
          </p>
        </div>

        <DashboardOverview />
      </div>
    </DashboardLayout>
  );
};

export default Overview;
