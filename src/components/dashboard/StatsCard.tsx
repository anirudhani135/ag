
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  tooltip?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  className,
  isLoading = false,
  isEmpty = false,
  tooltip,
}: StatsCardProps) => {
  const content = (
    <Card className={cn(
      "transition-all hover:shadow-lg p-6",
      isEmpty && "opacity-80",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-2">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-bold">{isEmpty ? "-" : value}</p>
        )}
        {description && !isLoading && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {isLoading && description && (
          <Skeleton className="h-4 w-32 mt-1" />
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
