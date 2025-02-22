
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnhancedRevenueDashboard } from "@/components/developer/revenue/EnhancedRevenueDashboard";

const Revenue = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
        <p className="text-muted-foreground">
          Track your earnings and analyze revenue streams
        </p>
        
        <EnhancedRevenueDashboard />
      </div>
    </DashboardLayout>
  );
};

export default Revenue;
