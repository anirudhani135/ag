
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import DeveloperDashboard from "@/components/developer/DeveloperDashboard";

const DeveloperOverview = () => {
  return (
    <DashboardLayout type="developer">
      <DeveloperDashboard />
    </DashboardLayout>
  );
};

export default DeveloperOverview;
