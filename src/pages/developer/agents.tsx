
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyAgents } from "@/components/developer/MyAgents";

const AgentsPage = () => {
  return (
    <DashboardLayout type="developer">
      <MyAgents />
    </DashboardLayout>
  );
};

export default AgentsPage;
