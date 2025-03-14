
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface MetricExplanationTooltipProps {
  title: string;
  description: string;
  goodValue?: string;
  warningThreshold?: string;
  criticalThreshold?: string;
  children: React.ReactNode;
}

export const MetricExplanationTooltip = ({
  title,
  description,
  goodValue,
  warningThreshold,
  criticalThreshold,
  children,
}: MetricExplanationTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center cursor-help">
            {children}
            <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm p-4">
          <div className="space-y-2">
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {(goodValue || warningThreshold || criticalThreshold) && (
              <div className="pt-1 mt-2 border-t text-xs space-y-1">
                {goodValue && (
                  <div className="flex gap-2">
                    <span className="text-green-500 font-medium">Good:</span>
                    <span>{goodValue}</span>
                  </div>
                )}
                {warningThreshold && (
                  <div className="flex gap-2">
                    <span className="text-amber-500 font-medium">Warning:</span>
                    <span>{warningThreshold}</span>
                  </div>
                )}
                {criticalThreshold && (
                  <div className="flex gap-2">
                    <span className="text-red-500 font-medium">Critical:</span>
                    <span>{criticalThreshold}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
