
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface FloatingCTAProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "user" | "developer";
}

export const FloatingCTA = ({ label, icon, onClick, className, type = "user" }: FloatingCTAProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (type === "developer") {
      toast({
        title: "Withdrawal Request",
        description: "Your withdrawal request has been initiated. Please check your email for confirmation.",
      });
    } else {
      navigate("/user/credits");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg",
        "flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200",
        "hover:scale-105 hover:shadow-xl",
        className
      )}
      aria-label={type === "developer" ? "Withdraw Funds" : "Buy Credits"}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};
