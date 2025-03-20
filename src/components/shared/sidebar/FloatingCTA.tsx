
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingCTAProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "user" | "developer";
  tooltip?: string;
}

export const FloatingCTA = ({ 
  label, 
  icon, 
  onClick, 
  className, 
  type = "user",
  tooltip
}: FloatingCTAProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Only navigate for user type, not for developer
    if (type === "user") {
      navigate("/user/credits");
    }
  };

  // Don't render for either type to avoid cluttering the UI
  if (type === "developer" || type === "user") {
    return null;
  }

  const buttonContent = (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full text-white shadow-lg",
        "flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300",
        "bg-black hover:bg-black/90 hover:scale-105 hover:shadow-xl",
        className
      )}
      aria-label="Buy Credits"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
};
