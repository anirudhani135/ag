
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";

interface BaseChartProps {
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  className?: string;
  children: ReactElement;
  height?: number;
}

export const BaseChart = ({
  title,
  subtitle,
  isLoading,
  className,
  children,
  height = 300
}: BaseChartProps) => {
  return (
    <Card className={cn("p-6", className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      <div style={{ height: `${height}px` }} className="w-full">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
