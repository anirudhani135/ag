
import { Coins, Bot, BarChart2, Star } from "lucide-react";
import { StatsCard } from "../../dashboard/StatsCard";
import { cn } from "@/lib/utils";

interface QuickStatsGridProps {
  creditBalance: number;
  activeAgents: number;
  monthlyRevenue: number;
  averageRating: number;
}

export const QuickStatsGrid = ({
  creditBalance,
  activeAgents,
  monthlyRevenue,
  averageRating,
}: QuickStatsGridProps) => {
  const lowCredits = creditBalance < 50;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Available Balance"
        value={`$${creditBalance.toFixed(2)}`}
        icon={Coins}
        description={lowCredits ? "Low balance!" : "Available for withdrawal"}
        className={cn(
          "transition-all duration-300",
          lowCredits && "border-red-500"
        )}
      />
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
