
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { memo, useCallback } from "react";

export const DeveloperActionsSection = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCreateAgentAction = useCallback(() => {
    // Pre-initialize navigation
    requestAnimationFrame(() => {
      navigate('/developer/agents/create');
      toast({
        title: "Navigation",
        description: "Creating a new agent"
      });
    });
  }, [navigate, toast]);
  
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Removed the create agent button from here as it's already in the agent management page */}
    </div>
  );
});

DeveloperActionsSection.displayName = 'DeveloperActionsSection';
