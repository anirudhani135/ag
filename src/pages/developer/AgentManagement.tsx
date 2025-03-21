
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AgentGrid } from "@/components/agent-management/AgentGrid";
import { AgentFilters } from "@/components/agent-management/AgentFilters";
import { AgentStats } from "@/components/agent-management/AgentStats";
import { EmptyStateGuide } from "@/components/agent-management/EmptyStateGuide";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AgentManagement = () => {
  const { data: agents, isLoading } = useQuery({
    queryKey: ["developer-agents"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('developer_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage, monitor, and deploy your AI agents
            </p>
          </div>
          
          <Button asChild size="lg" className="md:self-start">
            <Link to="/agent-external-deployment">
              <Plus className="mr-2 h-4 w-4" /> Create New Agent
            </Link>
          </Button>
        </div>
        
        {agents && agents.length > 0 ? (
          <>
            <AgentStats agents={agents} />
            <AgentFilters />
            <AgentGrid agents={agents} isLoading={isLoading} />
          </>
        ) : (
          <EmptyStateGuide isLoading={isLoading} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;
