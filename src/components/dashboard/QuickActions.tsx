
import { Button } from "@/components/ui/button";
import { Coins, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        size="lg"
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        onClick={() => navigate('/dashboard/credits')}
      >
        <Coins className="w-5 h-5 mr-2" />
        Buy Credits
      </Button>
      <Button
        size="lg"
        className="bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        onClick={() => navigate('/marketplace')}
      >
        <Plus className="w-5 h-5 mr-2" />
        Browse Agents
      </Button>
    </div>
  );
};
