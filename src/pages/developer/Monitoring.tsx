
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Monitoring = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">System Monitoring</h2>
        <p className="text-muted-foreground">
          Monitor your system's performance and health
        </p>
        {/* Monitoring dashboard will be implemented here */}
      </div>
    </DashboardLayout>
  );
};

export default Monitoring;
