
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AgentDeploymentList } from "@/components/developer/deployment/AgentDeploymentList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AgentModal } from "@/components/developer/AgentModals";

const Agents = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: agents, isLoading } = useQuery({
    queryKey: ['developer', 'agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          deployments (
            id,
            status,
            health_status,
            metrics,
            last_health_check
          )
        `)
        .eq('developer_id', (await supabase.auth.getUser()).data.user?.id)
        // Include agents with 'live' or 'draft' status - any valid statuses in your schema
        .in('status', ['live', 'draft', 'pending_review']);

      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Agents</h2>
            <p className="text-muted-foreground">
              Manage and monitor your deployed agents
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Agent
          </Button>
        </div>

        <AgentDeploymentList agents={agents || []} isLoading={isLoading} />

        <AgentModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          type="deploy"
        />
      </div>
    </DashboardLayout>
  );
};

export default Agents;
