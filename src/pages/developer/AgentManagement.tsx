
import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AgentGrid } from "@/components/agent-management/AgentGrid";
import { AgentFilters } from "@/components/agent-management/AgentFilters";
import { AgentStats } from "@/components/agent-management/AgentStats";
import { EmptyStateGuide } from "@/components/agent-management/EmptyStateGuide";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const AgentManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleViewChange = (value: 'grid' | 'list') => {
    setViewType(value);
  };

  const handleCreateAgent = () => {
    navigate('/agent-external-deployment');
  };

  const handleEditAgent = (id: string) => {
    // Navigate to edit agent page
    toast({
      title: "Edit Agent",
      description: `Editing agent with ID: ${id}`,
    });
  };

  const handleDeleteAgent = (id: string) => {
    // Handle agent deletion
    toast({
      title: "Delete Agent",
      description: `Deleting agent with ID: ${id}`,
    });
  };

  const handleViewMetrics = (id: string) => {
    // Navigate to agent metrics page
    toast({
      title: "View Metrics",
      description: `Viewing metrics for agent with ID: ${id}`,
    });
  };

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
            <AgentStats />
            <AgentFilters 
              onSearch={handleSearch}
              onSortChange={handleSortChange}
              onViewChange={handleViewChange}
              view={viewType}
            />
            <AgentGrid 
              agents={agents} 
              loading={isLoading} 
              onEdit={handleEditAgent}
              onDelete={handleDeleteAgent}
              onViewMetrics={handleViewMetrics}
              view={viewType}
            />
          </>
        ) : (
          <EmptyStateGuide onCreateAgent={handleCreateAgent} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;
