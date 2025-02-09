
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    title: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    developer?: {
      name: string;
      avatar_url?: string;
    };
    features?: string[];
    technical_requirements?: Record<string, any>;
  };
  onPurchase: () => void;
}

export const AgentDetailsModal = ({
  isOpen,
  onClose,
  agent,
  onPurchase,
}: AgentDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{agent.title}</span>
            <Badge variant="secondary">{agent.category}</Badge>
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{agent.rating.toFixed(1)}</span>
              </div>
              <span className="text-lg font-bold">${agent.price}</span>
            </div>

            <p className="text-sm text-muted-foreground">{agent.description}</p>

            {agent.features && agent.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Features</h4>
                <ul className="list-disc list-inside space-y-1">
                  {agent.features.map((feature, index) => (
                    <li key={index} className="text-sm">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {agent.technical_requirements && (
              <div className="space-y-2">
                <h4 className="font-semibold">Technical Requirements</h4>
                <div className="text-sm space-y-1">
                  {Object.entries(agent.technical_requirements).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onPurchase}>
                Purchase Agent
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
