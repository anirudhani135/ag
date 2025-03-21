
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ABTestingPanel } from "@/components/developer/agent-testing/ABTestingPanel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Define interfaces for the types
interface AgentVersion {
  id: string;
  name: string;
  created_at: string;
  version_number: string;
}

interface Agent {
  id: string;
  title: string;
  description: string;
  status: string;
}

const AgentTesting = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { toast } = useToast();

  const { data: agent, isLoading: isLoadingAgent } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: async () => {
      if (!agentId) return null;
      
      const { data, error } = await supabase
        .from('agents')
        .select('id, title, description, status')
        .eq('id', agentId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load agent details",
          variant: "destructive",
        });
        throw error;
      }

      return data as Agent;
    },
    enabled: !!agentId,
  });

  const { data: versions, isLoading: isLoadingVersions } = useQuery({
    queryKey: ['agent-versions', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      
      const { data, error } = await supabase
        .from('agent_versions')
        .select('id, version_number, created_at')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load agent versions",
          variant: "destructive",
        });
        throw error;
      }

      // Transform data to match expected format
      return (data || []).map(version => ({
        id: version.id,
        name: `Version ${version.version_number}`,
        createdAt: version.created_at
      }));
    },
    enabled: !!agentId,
  });

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/developer/agents">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="text-3xl font-bold tracking-tight">{agent?.title || 'Agent'} Testing</h2>
            </div>
            <p className="text-muted-foreground mt-1">
              Create and manage A/B tests to optimize your agent's performance
            </p>
          </div>
        </div>

        <ABTestingPanel 
          agentId={agentId || ''} 
          versions={versions || []} 
        />
      </div>
    </DashboardLayout>
  );
};

export default AgentTesting;
