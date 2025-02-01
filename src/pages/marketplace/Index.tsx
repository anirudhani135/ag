import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";

const Marketplace = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        <Card className="p-6">
          <p>Marketplace coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;