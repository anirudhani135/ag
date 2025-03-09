
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import AgentDetailView from "@/components/agent-detail/AgentDetailView";

const AgentDetailPage = () => {
  return (
    <DashboardLayout type="developer">
      <AgentDetailView />
    </DashboardLayout>
  );
};

export default AgentDetailPage;
