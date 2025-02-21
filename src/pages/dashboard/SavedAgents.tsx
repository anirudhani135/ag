
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
            {savedAgents.map((saved: any) => (
              <Card key={saved.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      {saved.agents.title}
                    </span>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {saved.agents.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      By {saved.agents.developer.name}
                    </span>
                    <span className="font-medium">
                      ${saved.agents.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
