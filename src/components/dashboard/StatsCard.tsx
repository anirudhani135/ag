import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: React.ReactNode;
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("transition-all hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="mt-2 text-sm">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};