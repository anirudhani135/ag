
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { logActivity } from "@/utils/activityLogger";

const SavedAgents = () => {
  const { data: savedAgents, isLoading } = useQuery({
    queryKey: ['saved-agents-full'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('saved_agents')
        .select(`
          *,
          agents (
            *,
            developer:profiles (name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });
  
  const { data: agentActivity } = useQuery({
    queryKey: ['agent-activity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .in('activity_type', ['agent_view', 'agent_purchase', 'testing'])
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const activityByAgent = {};
      data.forEach(activity => {
        const metadata = activity.metadata || {};
        // Check if metadata is an object and has agent_id property
        if (metadata && typeof metadata === 'object' && 'agent_id' in metadata) {
          const agentId = metadata.agent_id;
          
          if (agentId && !activityByAgent[agentId]) {
            activityByAgent[agentId] = {
              lastUsed: activity.created_at,
              usageCount: 1,
              lastAction: activity.activity_type
            };
          } else if (agentId) {
            activityByAgent[agentId].usageCount++;
            if (new Date(activity.created_at) > new Date(activityByAgent[agentId].lastUsed)) {
              activityByAgent[agentId].lastUsed = activity.created_at;
              activityByAgent[agentId].lastAction = activity.activity_type;
            }
          }
        }
      });
      
      return activityByAgent;
    }
  });

  const handleLaunchAgent = async (agent: any) => {
    if (agent.title === "Content Creator" && agent.id === "agent-3") {
      window.open("https://app.relevanceai.com/agents/f1db6c/eab09b449107-4982-81be-c44dc78eef1d/b990b2d6-843f-47b7-9395-bf22967974ff/share?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false", "_blank");
      
      await logActivity('agent_view', {
        agent_id: agent.id,
        agent_name: agent.title,
        action: 'launch',
        status: 'success'
      });
    } else {
      // Handle other agents launch
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Saved Agents</h2>
          <p className="text-muted-foreground">Your favorite AI agents</p>
        </div>

        {isLoading ? (
          <p>Loading saved agents...</p>
        ) : savedAgents?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {savedAgents.map((saved: any) => {
              const agentUsage = agentActivity?.[saved.agents.id];
              
              return (
                <Card key={saved.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        {saved.agents.title}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleLaunchAgent(saved.agents)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {saved.agents.description}
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          By {saved.agents.developer?.name || "Unknown Developer"}
                        </span>
                        <span className="font-medium">
                          ${saved.agents.price}
                        </span>
                      </div>
                      
                      {agentUsage && (
                        <div className="mt-2 text-xs flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {agentUsage.lastAction === 'agent_view' ? 'Used' : 
                            agentUsage.lastAction === 'testing' ? 'Tested' : 'Purchased'} {formatDistanceToNow(new Date(agentUsage.lastUsed), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Star className="h-12 w-12 text-muted mb-4" />
              <p className="text-lg font-medium mb-2">No saved agents yet</p>
              <p className="text-muted-foreground text-center max-w-md">
                Browse the marketplace and save your favorite AI agents to access them quickly from here.
              </p>
              <Button className="mt-4">
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedAgents;
