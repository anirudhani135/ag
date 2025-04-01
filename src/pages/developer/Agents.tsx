
import React from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AgentDeploymentList } from "@/components/developer/deployment/AgentDeploymentList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AgentModal } from "@/components/developer/AgentModals";
import { Link } from "react-router-dom";

const Agents = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: agents, isLoading } = useQuery({
    queryKey: ['developer', 'agents'],
    queryFn: async () => {
      // Simplified query without requiring specific developer_id
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Agents</h2>
            <p className="text-muted-foreground">
              Manage and monitor deployed agents
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/agent-external-deployment">
                <Plus className="w-4 h-4 mr-2" />
                Deploy External Agent
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Agent
            </Button>
          </div>
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
