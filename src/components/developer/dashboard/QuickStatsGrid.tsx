
import { Bot, BarChart2, Star } from "lucide-react";
import { StatsCard } from "../../dashboard/StatsCard";

interface QuickStatsGridProps {
  creditBalance: number;
  activeAgents: number;
  monthlyRevenue: number;
  averageRating: number;
}

export const QuickStatsGrid = ({
  activeAgents,
  monthlyRevenue,
  averageRating,
}: Omit<QuickStatsGridProps, 'creditBalance'>) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Published Agents"
        value={activeAgents}
        icon={Bot}
        description="Currently active"
        className="hover:shadow-md transition-shadow"
      />
      <StatsCard
        title="Monthly Revenue"
        value={`$${monthlyRevenue.toFixed(2)}`}
        icon={BarChart2}
        description="This month's earnings"
        className="hover:shadow-md transition-shadow"
      />
      <StatsCard
        title="Average Rating"
        value={`${averageRating.toFixed(1)}/5.0`}
        icon={Star}
        description="Based on user reviews"
        className="hover:shadow-md transition-shadow"
      />
    </div>
  );
};
