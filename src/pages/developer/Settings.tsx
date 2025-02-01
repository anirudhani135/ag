import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";

const DeveloperSettings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Developer Settings</h2>
        <Card className="p-6">
          <p>Developer settings interface coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSettings;