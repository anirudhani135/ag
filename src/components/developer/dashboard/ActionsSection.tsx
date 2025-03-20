
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { memo, useCallback } from "react";

interface DeveloperActionsSectionProps {
  className?: string;
}

export const DeveloperActionsSection = memo(({ className }: DeveloperActionsSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCreateAgentAction = useCallback(() => {
    // Pre-initialize navigation for better performance
    requestAnimationFrame(() => {
      navigate('/developer/agents/create');
      toast({
        title: "Navigation",
        description: "Creating a new agent"
      });
    });
  }, [navigate, toast]);
  
  return (
    <div className={`flex flex-wrap gap-4 justify-start ${className || ''}`}>
      <Button 
        size="lg" 
        onClick={handleCreateAgentAction} 
        className="text-primary-foreground shadow-md transition-all duration-300 rounded-lg text-base bg-zinc-950 hover:bg-zinc-800 text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Agent
      </Button>
    </div>
  );
});

DeveloperActionsSection.displayName = 'DeveloperActionsSection';
