
import { lazy, Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot, Calendar, DollarSign, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/shared/tables/DataTable";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Lazy loaded components
const DeployAgentModal = lazy(() => import("./modals/DeployAgentModal"));
const EditAgentModal = lazy(() => import("./modals/EditAgentModal"));

interface Agent {
  id: string;
  title: string;
  status: string;
  version: string;
  price: number;
  created_at: string;
}

const columns = [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === "live"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price");
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price as number);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const agent = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-100 text-gray-700"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-100 text-gray-700"
          >
            Update
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

export const MyAgents = () => {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("developer_id", user.data.user?.id);

      if (error) throw error;
      return data as Agent[];
    },
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["agent-stats"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data: totalAgents, error: agentsError } = await supabase
        .from("agents")
        .select("*", { count: "exact" })
        .eq("developer_id", user.data.user?.id);

      const { data: liveAgents, error: liveError } = await supabase
        .from("agents")
        .select("*", { count: "exact" })
        .eq("developer_id", user.data.user?.id)
        .eq("status", "live");

      if (agentsError || liveError) throw agentsError || liveError;

      const { data: revenue, error: revenueError } = await supabase
        .from("agents")
        .select("price")
        .eq("developer_id", user.data.user?.id);

      if (revenueError) throw revenueError;

      const totalRevenue = revenue?.reduce((acc, curr) => acc + (curr.price || 0), 0);

      return {
        totalAgents: totalAgents?.length || 0,
        liveAgents: liveAgents?.length || 0,
        totalRevenue: totalRevenue || 0,
      };
    },
  });

  const handleCreateAgent = () => {
    navigate("/agent-creation");
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen space-y-6 p-8 pt-16 pb-16 bg-background">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Agent Management</h2>
            <p className="text-muted-foreground">
              Deploy and manage your AI agents
            </p>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => setIsDeployModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Bot className="mr-2 h-4 w-4" />
              Deploy Existing Agent
            </Button>
            <Button 
              onClick={handleCreateAgent}
              variant="outline"
              className="bg-white hover:bg-gray-100 border-primary text-primary hover:text-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Agent
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Total Agents</h3>
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {isLoadingStats ? "[Loading...]" : stats?.totalAgents}
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Active Deployments</h3>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {isLoadingStats ? "[Loading...]" : stats?.liveAgents}
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {isLoadingStats
                ? "[Loading...]"
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(stats?.totalRevenue || 0)}
            </p>
          </Card>
        </div>

        <Card className="p-6 bg-white shadow-md">
          <DataTable
            columns={columns}
            data={agents || []}
            isLoading={isLoadingAgents}
            noResultsMessage="No agents found. Deploy your first agent to get started!"
          />
        </Card>

        {isDeployModalOpen && (
          <Suspense fallback={null}>
            <DeployAgentModal
              isOpen={isDeployModalOpen}
              onClose={() => setIsDeployModalOpen(false)}
              onDeploy={() => {
                toast({
                  title: "Coming Soon",
                  description: "Agent deployment will be available soon.",
                });
              }}
            />
          </Suspense>
        )}

        {isEditModalOpen && selectedAgent && (
          <Suspense fallback={null}>
            <EditAgentModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              agent={selectedAgent}
            />
          </Suspense>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAgents;
