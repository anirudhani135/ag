
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  version_number: string;
  deployment_status: string;
}

interface AgentGridProps {
  agents: Agent[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewMetrics: (id: string) => void;
  view: 'grid' | 'list';
}

export const AgentGrid = ({
  agents,
  loading,
  onEdit,
  onDelete,
  onViewMetrics,
  view
}: AgentGridProps) => {
  if (loading) {
    return (
      <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
      {agents.map((agent) => (
        <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{agent.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {agent.description}
              </p>
            </div>
            <Badge className={getStatusColor(agent.deployment_status)}>
              {agent.deployment_status}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">${agent.price}</p>
              <p className="text-xs text-muted-foreground">
                Version {agent.version_number}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(agent.id)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(agent.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewMetrics(agent.id)}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
