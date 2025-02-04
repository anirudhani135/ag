import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { NotificationsCenter } from "@/components/dashboard/NotificationsCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Star,
  History,
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const DashboardOverview = () => {
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: savedAgents } = useQuery({
    queryKey: ['saved-agents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('saved_agents')
        .select('*, agents(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  const stats = [
    {
      title: "Credit Balance",
      value: profile?.credit_balance || 0,
      icon: CreditCard,
      description: "Available credits",
    },
    {
      title: "Saved Agents",
      value: savedAgents?.length || 0,
      icon: Star,
      description: "Favorite agents",
    },
    {
      title: "Recent Activity",
      value: "Active",
      icon: Activity,
      description: "Last 24 hours",
    },
    {
      title: "Usage Status",
      value: "Normal",
      icon: History,
      description: "Within limits",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your account
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              className="hover:border-accent transition-colors"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed />
          <NotificationsCenter />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Saved Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedAgents?.length ? (
                savedAgents.map((saved: any) => (
                  <div key={saved.id} className="flex items-center justify-between p-4 rounded-lg border hover:border-accent transition-colors">
                    <div>
                      <p className="font-medium">{saved.agents.title}</p>
                      <p className="text-sm text-muted-foreground">{saved.agents.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No saved agents yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;