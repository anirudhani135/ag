
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  TrendingUp,
  Users,
  ActivitySquare
} from "lucide-react";

interface RevenueMetricsProps {
  startDate: Date;
  endDate: Date;
}

export const EnhancedRevenueMetrics = ({ startDate, endDate }: RevenueMetricsProps) => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['revenue-metrics', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_details')
        .select('*')
        .gte('period_start', startDate.toISOString())
        .lte('period_end', endDate.toISOString())
        .single();

      if (error) throw error;
      return data;
    }
  });

  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    change?: number
  ) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {typeof change !== 'undefined' && (
            <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
              {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(null).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-24 animate-pulse bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {renderMetricCard(
        "Total Revenue",
        `$${metrics?.total_revenue?.toLocaleString() || '0'}`,
        <DollarSign className="w-6 h-6 text-primary" />,
        metrics?.growth_rate
      )}
      {renderMetricCard(
        "Average Transaction",
        `$${metrics?.average_transaction_value?.toLocaleString() || '0'}`,
        <TrendingUp className="w-6 h-6 text-primary" />
      )}
      {renderMetricCard(
        "Transaction Count",
        metrics?.transaction_count?.toLocaleString() || '0',
        <Users className="w-6 h-6 text-primary" />
      )}
      {renderMetricCard(
        "Period Comparison",
        `${((metrics?.total_revenue || 0) / (metrics?.comparison_period_revenue || 1) * 100).toFixed(1)}%`,
        <ActivitySquare className="w-6 h-6 text-primary" />
      )}
    </div>
  );
};
