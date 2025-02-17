
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, Users, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ icon: Icon, label, value, loading }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  loading?: boolean;
}) => (
  <Card className="p-6 flex items-center space-x-4">
    <div className="p-3 bg-primary/10 rounded-lg">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    {loading ? (
      <div className="flex-1">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-24" />
      </div>
    ) : (
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <h4 className="text-2xl font-semibold">{value}</h4>
      </div>
    )}
  </Card>
);

export const AgentStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const { data: agents, error } = await supabase
        .from('agents')
        .select('*');

      if (error) throw error;

      // Calculate stats from agents data
      const totalAgents = agents?.length || 0;
      const activeDeployments = agents?.filter(a => a.deployment_status === 'active').length || 0;
      const totalRevenue = agents?.reduce((acc, agent) => acc + (agent.price || 0), 0) || 0;

      return {
        totalAgents,
        activeDeployments,
        totalRevenue: totalRevenue.toFixed(2)
      };
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={ChartBar}
        label="Total Agents"
        value={stats?.totalAgents || 0}
        loading={isLoading}
      />
      <StatCard
        icon={Activity}
        label="Active Deployments"
        value={stats?.activeDeployments || 0}
        loading={isLoading}
      />
      <StatCard
        icon={Users}
        label="Total Revenue"
        value={`$${stats?.totalRevenue || '0.00'}`}
        loading={isLoading}
      />
    </div>
  );
};
