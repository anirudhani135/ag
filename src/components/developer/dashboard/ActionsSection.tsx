
import { Button } from "@/components/ui/button";
import { Plus, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { memo, useCallback } from "react";

export const DeveloperActionsSection = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Memoize navigation handlers to prevent recreating functions on re-renders
  const handleWithdrawAction = useCallback(() => {
    // Pre-initialize navigation
    requestAnimationFrame(() => {
      navigate('/developer/revenue');
      toast({
        title: "Navigation",
        description: "Accessing revenue withdrawal page",
      });
    });
  }, [navigate, toast]);

  const handleCreateAgentAction = useCallback(() => {
    // Pre-initialize navigation
    requestAnimationFrame(() => {
      navigate('/developer/agents/create');
      toast({
        title: "Navigation",
        description: "Creating a new agent",
      });
    });
  }, [navigate, toast]);

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <Button
        size="lg"
        className="bg-white text-black border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-300"
        onClick={handleWithdrawAction}
      >
        <DollarSign className="w-5 h-5 mr-2" />
        Withdraw Funds
      </Button>
      <Button
        size="lg"
        className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-300"
        onClick={handleCreateAgentAction}
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Agent
      </Button>
    </div>
  );
});

DeveloperActionsSection.displayName = 'DeveloperActionsSection';
