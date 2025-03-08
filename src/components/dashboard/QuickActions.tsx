
import { Button } from "@/components/ui/button";
import { Coins, Plus, DollarSign } from "lucide-react";
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
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => handleAction('/developer/revenue', 'Accessing revenue withdrawal page')}
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Withdraw Funds
        </Button>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => handleAction('/developer/agents/create', 'Creating a new agent')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Agent
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
        onClick={() => handleAction('/user/credits', 'Accessing credit purchase page')}
      >
        <Coins className="w-5 h-5 mr-2" />
        Buy Credits
      </Button>
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
        onClick={() => handleAction('/marketplace', 'Browsing available agents')}
      >
        <Plus className="w-5 h-5 mr-2" />
        Browse Agents
      </Button>
    </div>
  );
};
