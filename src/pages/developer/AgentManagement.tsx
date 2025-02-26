
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { Bot, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AgentStats } from "@/components/agent-management/AgentStats";
import { AgentFilters } from "@/components/agent-management/AgentFilters";
import { AgentGrid } from "@/components/agent-management/AgentGrid";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AgentManagement = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents', search, sort],
    queryFn: async () => {
      let query = supabase
        .from('agents')
        .select('*');

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query.order(sort, { ascending: sort === 'title' });
      
      if (error) {
        toast.error("Failed to fetch agents");
        throw error;
      }
      
      return data;
    }
  });

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-8 pt-16 pb-16 space-y-8 bg-background">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
            <p className="mt-2 text-muted-foreground">Create and manage your AI agents</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              onClick={() => navigate("/developer/agents/create")}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Agent
            </Button>
          </div>
        </div>

        <AgentStats className="grid gap-4 md:grid-cols-3" />
        
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <AgentFilters
              onSearch={setSearch}
              onSortChange={setSort}
              onViewChange={setView}
              view={view}
              className="mb-6"
            />
            
            <AgentGrid
              agents={agents || []}
              loading={isLoading}
              onEdit={() => {}}
              onDelete={() => {}}
              onViewMetrics={() => {}}
              view={view}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;
