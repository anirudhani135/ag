
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AgentCreationHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/developer/agents")}
          className="hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Agents
        </Button>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Create New Agent
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Configure your AI agent's settings and capabilities. Follow the steps below to set up your agent.
      </p>
    </div>
  );
};
