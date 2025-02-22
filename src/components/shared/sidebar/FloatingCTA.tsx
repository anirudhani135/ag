
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingCTAProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  type?: "user" | "developer";
}

export const FloatingCTA = ({ label, icon, onClick, className, type = "user" }: FloatingCTAProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-8 right-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg",
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
