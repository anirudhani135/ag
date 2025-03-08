
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  isLoading?: boolean;
  emptyState?: boolean;
  tooltip?: string;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  icon,
  change,
  isLoading = false,
  emptyState = false,
  tooltip,
  className
}: MetricCardProps) => {
  if (isLoading) {
    return (
      <Card className={cn("p-6 transition-all duration-200 hover:shadow-md", className)}>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-16" />
      </Card>
    );
  }

  const content = (
    <Card className={cn(
      "p-6 transition-all duration-200 hover:shadow-md", 
      emptyState && "opacity-70",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">
            {emptyState ? "-" : value}
          </h3>
          {typeof change !== 'undefined' && !emptyState && (
            <p className={`text-sm mt-2 flex items-center ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};
