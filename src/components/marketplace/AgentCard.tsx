
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Info, ShoppingCart, ExternalLink } from "lucide-react";
import { AgentDetailsModal } from "./AgentDetailsModal";
import { useToast } from "@/components/ui/use-toast";

interface AgentCardProps {
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  features?: string[];
  onView: () => void;
}

export const AgentCard = ({
  title,
  description,
  price,
  category,
  rating,
  features = [],
  onView
}: AgentCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Agent added to collection",
      description: `${title} has been added to your agents.`,
      variant: "default",
    });
  };

  const handleTryDemo = () => {
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
              i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md">
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="mb-2">
              {category}
            </Badge>
            {renderRatingStars(rating)}
          </div>

          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
            {description}
          </p>

          {features.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{features.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="mt-auto">
            <div className={`text-lg font-bold mb-3 ${price === 0 ? "text-success" : "text-primary"}`}>
              {price === 0 ? "Free" : `$${price.toFixed(2)}`}
            </div>

            <div className="flex gap-2">
              <Button
                variant={price === 0 ? "success" : "primary"}
                size="sm"
                className="flex-1 text-white"
                onClick={handlePurchase}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {price === 0 ? "Get Agent" : "Purchase"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowDetails(true)}
              >
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AgentDetailsModal
        open={showDetails}
        onOpenChange={setShowDetails}
        title={title}
        description={description}
        price={price}
        category={category}
        rating={rating}
        features={features}
        onPurchase={handlePurchase}
        onTryDemo={handleTryDemo}
      />
    </>
  );
};
