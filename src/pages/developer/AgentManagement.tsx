
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { Bot, Plus, Sparkles } from "lucide-react";
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
      <div className="min-h-screen p-4 md:p-8 space-y-8 bg-background">
        {/* Header Section with improved visual hierarchy */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
                Agent Management
              </h1>
              <p className="text-muted-foreground max-w-md">
                Create and manage your AI agents with our intuitive interface
              </p>
            </div>

            <Button
              onClick={() => navigate("/developer/agents/create")}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-6 shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-200" />
              Create New Agent
            </Button>
          </div>
        </div>

        {/* Stats Section with improved layout */}
        <div className="grid gap-6 md:grid-cols-3">
          <AgentStats />
        </div>
        
        {/* Main Content Section */}
        <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-4 md:p-6">
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
