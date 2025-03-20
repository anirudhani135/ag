
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export interface QuickActionsProps {
  type: "user" | "developer";
}

export const QuickActions = ({ type }: QuickActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (path: string, message: string) => {
    navigate(path);
    toast({
      title: "Navigation",
      description: message,
    });
  };

  if (type === "developer") {
    return (
      <div className="flex flex-wrap gap-4 justify-start">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-300"
          onClick={() => handleAction('/developer/agents/create', 'Creating a new agent')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Agent
        </Button>
      </div>
    );
  }

  // For user dashboard, don't display any quick actions buttons
  return null;
};
