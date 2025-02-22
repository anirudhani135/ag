
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentStats } from "@/components/agent-management/AgentStats";
import { AgentFilters } from "@/components/agent-management/AgentFilters";
import { AgentGrid } from "@/components/agent-management/AgentGrid";
import { toast } from "sonner";

const AgentManagement = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [view, setView] = useState<'grid' | 'list'>('grid');

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

  const handleEdit = (id: string) => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Agent deleted successfully");
    } catch (error) {
      toast.error("Failed to delete agent");
    }
  };

  const handleViewMetrics = (id: string) => {
    toast.info("Metrics view coming soon");
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Agent Management</h2>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </Button>
        </div>

        <AgentStats />

        <AgentFilters
          onSearch={setSearch}
          onSortChange={setSort}
          onViewChange={setView}
          view={view}
        />

        <AgentGrid
          agents={agents || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMetrics={handleViewMetrics}
          view={view}
        />
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;
