import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

const AgentManagement = () => {
  // Fetch agents
  const { data: agents } = useQuery({
    queryKey: ['developer', 'agents'],
    queryFn: async () => {
      console.log('Fetching agents...');
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching agents:', error);
        throw error;
      }
      
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Agent Management</h2>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </Button>
        </div>

        {/* Agents List */}
        <div className="grid gap-4">
          {agents?.map((agent) => (
            <Card key={agent.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{agent.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {agent.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">${agent.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Version {agent.version_number}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {!agents?.length && (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">
                No agents found. Create your first agent to get started.
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;