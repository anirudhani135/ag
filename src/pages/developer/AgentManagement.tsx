
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot, Plus, Activity, DollarSign, 
  ChevronRight, BarChart2, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AgentStats } from "@/components/agent-management/AgentStats";
import { AgentFilters } from "@/components/agent-management/AgentFilters";
import { AgentGrid } from "@/components/agent-management/AgentGrid";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AgentDetailPanel from "@/components/agent-management/AgentDetailPanel";

const AgentManagement = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
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

  const handleCreateAgent = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      navigate("/developer/agents/create");
    }, 500);
  };

  const handleViewAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  const handleCloseAgentDetail = () => {
    setSelectedAgentId(null);
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="flex text-sm text-muted-foreground" aria-label="Breadcrumb">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground">Agent Management</span>
          </nav>
        </div>

        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Agent Management
                </h1>
                <p className="text-muted-foreground max-w-md">
                  Create and manage your AI agents with our intuitive interface
                </p>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleCreateAgent}
                      className="relative bg-primary hover:bg-primary/90 text-white font-medium h-12 px-6 
                        shadow-lg hover:shadow-xl transition-all duration-200 group animate-in fade-in-0 
                        hover:scale-105"
                      disabled={isDeploying}
                    >
                      {isDeploying ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                      )}
                      Create New Agent
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start creating a new AI agent</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                    transition-all duration-200 hover:scale-105 cursor-help">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                        <p className="text-2xl font-bold">{agents?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total number of agents created</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                    transition-all duration-200 hover:scale-105 cursor-help">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Deployments</p>
                        <p className="text-2xl font-bold">
                          {agents?.filter(a => a.deployment_status === 'active')?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of currently active agents</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                    transition-all duration-200 hover:scale-105 cursor-help">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">
                          ${agents?.reduce((acc, agent) => acc + (agent.price || 0), 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total revenue generated from agents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        
          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm ${selectedAgentId ? 'md:w-1/2' : 'w-full'}`}>
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
                  onEdit={handleViewAgent}
                  onDelete={() => {}}
                  onViewMetrics={handleViewAgent}
                  view={view}
                />
              </div>
            </div>
            
            {selectedAgentId && (
              <div className="md:w-1/2">
                <AgentDetailPanel 
                  agentId={selectedAgentId} 
                  onClose={handleCloseAgentDetail} 
                />
              </div>
            )}
          </div>

          {/* Recent Activity Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm">Agent "{agents?.[i-1]?.title || 'AI Assistant'}" was {i === 1 ? 'deployed' : i === 2 ? 'updated' : 'reviewed'}</p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;
