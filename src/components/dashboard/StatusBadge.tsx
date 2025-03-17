
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface StatusBadgeProps {
  initialState?: "loading" | "ready" | "error";
  onStatusChange?: (status: "loading" | "ready" | "error") => void;
}

export const StatusBadge = ({ initialState = "loading", onStatusChange }: StatusBadgeProps) => {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(initialState);

  useEffect(() => {
    // If initially loading, automatically transition to ready after a delay
    if (initialState === "loading") {
      const timer = setTimeout(() => {
        setStatus("ready");
        onStatusChange?.("ready");
      }, Math.random() * 1000 + 500); // Random delay between 500-1500ms for realistic feel
      
      return () => clearTimeout(timer);
    }
  }, [initialState, onStatusChange]);

  let content;
  
  switch (status) {
    case "loading":
      content = (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Loading</span>
        </Badge>
      );
      break;
    case "ready":
      content = (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Ready</span>
        </Badge>
      );
      break;
    case "error":
      content = (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Error</span>
        </Badge>
      );
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          {status === "loading" && "Dashboard is loading data..."}
          {status === "ready" && "Dashboard is up-to-date"}
          {status === "error" && "Error loading some dashboard data"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
