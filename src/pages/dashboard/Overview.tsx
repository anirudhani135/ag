import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Users, Star, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DashboardOverview = () => {
  const { data: activityData, isLoading: isActivityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    {
      title: "Total Credits",
      value: "1,234",
      icon: CreditCard,
      change: "+12%",
    },
    {
      title: "Active Agents",
      value: "12",
      icon: Users,
      change: "+3",
    },
    {
      title: "Usage This Month",
      value: "845",
      icon: Activity,
      change: "+20%",
    },
    {
      title: "Favorite Agents",
      value: "6",
      icon: Star,
      change: "+2",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your agents.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={`${stat.change} from last month`}
            />
          ))}
        </div>

        {/* Activity Feed Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isActivityLoading ? (
                <p className="text-muted-foreground">Loading activity...</p>
              ) : activityData?.length ? (
                activityData.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Agents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Favorite Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">Your favorite agents will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;