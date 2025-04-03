
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Info, ShoppingCart, ExternalLink } from "lucide-react";
import { AgentDetailsModal } from "./AgentDetailsModal";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  categories?: {
    name: string;
  };
  category?: string;
  rating: number;
  features?: string[];
  developer_id?: string;
  documentation_url?: string;
  version?: string;
  created_at?: string;
  updated_at?: string;
  technical_requirements?: {
    min_memory?: string;
    recommended_cpu?: string;
    compatible_platforms?: string[];
  };
}

interface AgentCardProps {
  agent: Agent;
  onClick: (agentId: string) => void;
}

export const AgentCard = ({ agent, onClick }: AgentCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleHire = () => {
    toast({
      title: "Agent hired",
      description: `${agent.title} has been added to your agents.`,
      variant: "default",
    });
  };

  const handleTryDemo = () => {
    navigate(`/agent/${agent.id}/chat`);
    toast({
      title: "Demo started",
      description: "You can now try this agent's functionality.",
      variant: "default",
    });
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Get category name from either format
  const categoryName = agent.categories?.name || agent.category || "General";

  // Convert price to credits - simple conversion for mock data
  const priceInCredits = Math.max(Math.round(agent.price / 10), 1);

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md border-2 border-border">
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
              {categoryName}
            </Badge>
            {renderRatingStars(agent.rating)}
          </div>

          <h3 className="text-lg font-semibold mb-2 text-primary">{agent.title}</h3>
          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
            {agent.description}
          </p>

          {agent.features && agent.features.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {agent.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700">
                  {feature}
                </Badge>
              ))}
              {agent.features.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
                  +{agent.features.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="mt-auto">
            <div className={`text-lg font-bold mb-3 ${agent.price === 0 ? "text-emerald-600" : "text-blue-600"}`}>
              {agent.price === 0 ? "Free" : `${priceInCredits} credits`}
            </div>

            <div className="flex gap-2">
              <Button
                variant={agent.price === 0 ? "success" : "primary"}
                size="sm"
                className={`flex-1 text-white font-medium ${agent.price === 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}
                onClick={handleHire}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {agent.price === 0 ? "Hire Agent" : "Hire"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-2 font-medium bg-white text-primary hover:bg-gray-50"
                onClick={() => setShowDetails(true)}
              >
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {showDetails && (
        <AgentDetailsModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          agent={agent}
          onPurchase={handleHire}
        />
      )}
    </>
  );
};
