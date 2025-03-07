
import { Button } from "@/components/ui/button";
import { Coins, Plus, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface QuickActionsProps {
  type: "user" | "developer";
}

export const QuickActions = ({ type }: QuickActionsProps) => {
  const navigate = useNavigate();

  if (type === "developer") {
    return (
      <div className="flex flex-wrap gap-4 justify-start">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/developer/revenue')}
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Withdraw Funds
        </Button>
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/developer/agents/new')}
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
        onClick={() => navigate('/dashboard/credits')}
      >
        <Coins className="w-5 h-5 mr-2" />
        Buy Credits
      </Button>
      <Button
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
        onClick={() => navigate('/marketplace')}
      >
        <Plus className="w-5 h-5 mr-2" />
        Browse Agents
      </Button>
    </div>
  );
};
