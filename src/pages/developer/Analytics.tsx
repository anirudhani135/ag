import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Card className="p-6">
          <p>Analytics dashboard coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;