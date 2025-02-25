import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Plus, Activity, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AgentModal } from "./AgentModals";
import { useState } from "react";

interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  version_number: string;
  deployment_status: string;
}

const StatsCard = ({ title, value, icon: Icon, isLoading }: {
  title: string;
  value: string | number;
  icon: any;
  isLoading?: boolean;
}) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-200">
    {isLoading ? (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    )}
  </Card>
);

const AgentTable = ({ agents, isLoading, onEdit }: { 
  agents: Agent[], 
  isLoading: boolean,
  onEdit: (agent: Agent) => void 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No agents deployed yet. Deploy your first agent to get started!
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.title}</TableCell>
                <TableCell>
                  <Badge 
                    className={agent.deployment_status === 'active' ? 
                      'bg-green-500/10 text-green-500' : 
                      'bg-gray-500/10 text-gray-500'
                    }
                  >
                    {agent.deployment_status}
                  </Badge>
                </TableCell>
                <TableCell>v{agent.version_number}</TableCell>
                <TableCell>${agent.price}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    onClick={() => onEdit(agent)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    onClick={() => onEdit(agent)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const MyAgents = () => {
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const { data: agents } = await supabase
        .from('agents')
        .select('*');

      return {
        totalAgents: agents?.length || 0,
        activeDeployments: agents?.filter(a => a.deployment_status === 'active').length || 0,
        totalRevenue: agents?.reduce((acc, agent) => acc + (agent.price || 0), 0) || 0
      };
    }
  });

  const handleDeploySubmit = async (data: any) => {
    const { error } = await supabase
      .from('agents')
      .insert([{
        ...data,
        developer_id: '123', // Replace with actual developer ID
        deployment_status: 'pending'
      }]);

    if (error) throw error;
    toast.success("Agent deployment initiated!");
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedAgent) return;

    const { error } = await supabase
      .from('agents')
      .update(data)
      .eq('id', selectedAgent.id);

    if (error) throw error;
    toast.success("Agent updated successfully!");
  };

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Agents</h2>
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => setDeployModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Deploy New Agent
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Agents"
          value={stats?.totalAgents || 0}
          icon={Bot}
          isLoading={isLoadingStats}
        />
        <StatsCard
          title="Active Deployments"
          value={stats?.activeDeployments || 0}
          icon={Activity}
          isLoading={isLoadingStats}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          isLoading={isLoadingStats}
        />
      </div>

      <AgentTable 
        agents={agents || []} 
        isLoading={isLoadingAgents}
        onEdit={handleEdit}
      />

      <Card className="p-6 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <p className="text-muted-foreground">
          Coming Soon: View your recent agent activity here
        </p>
      </Card>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
        <p className="text-muted-foreground">
          Coming Soon: Access detailed analytics and insights for your agents
        </p>
      </div>

      <AgentModal
        open={deployModalOpen}
        onOpenChange={setDeployModalOpen}
        type="deploy"
        onSubmit={handleDeploySubmit}
      />

      <AgentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        type="edit"
        initialData={selectedAgent || undefined}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};
