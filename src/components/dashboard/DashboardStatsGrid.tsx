
import { Coins, Bot, BarChart2, Star } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { cn } from "@/lib/utils";

interface DashboardStatsGridProps {
  creditBalance: number;
  activeAgents: number;
  monthlyUsage: number;
  averageRating: number;
}

export const DashboardStatsGrid = ({
  creditBalance,
  activeAgents,
  monthlyUsage,
  averageRating,
}: DashboardStatsGridProps) => {
  const lowCredits = creditBalance < 50;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Available Credits"
        value={creditBalance}
        icon={Coins}
        description={lowCredits ? "Low balance!" : "Credits remaining"}
        className={cn(
          "transition-all duration-500",
          lowCredits && "animate-pulse border-red-500"
        )}
      />
      <StatsCard
        title="Active Agents"
        value={activeAgents}
        icon={Bot}
        description="Currently active"
        className="hover:shadow-lg transition-shadow"
      />
      <StatsCard
        title="Usage This Month"
        value={`${monthlyUsage} calls`}
        icon={BarChart2}
        description="API Usage"
      />
      <StatsCard
        title="Average Rating"
        value={`${averageRating.toFixed(1)}/5.0`}
        icon={Star}
        description="Based on your reviews"
        className="hover:shadow-lg transition-shadow"
      />
    </div>
  );
};
