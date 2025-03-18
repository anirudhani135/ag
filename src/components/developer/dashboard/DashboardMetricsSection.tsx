
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreditUsageChart } from "../../dashboard/CreditUsageChart";
import { UserActivityFeed } from "../../dashboard/UserActivityFeed";
import { type UserActivity } from "@/types/dashboard";

interface DashboardMetricsSectionProps {
  activities?: UserActivity[];
  isLoading?: boolean;
}

export const DashboardMetricsSection = ({
  activities,
  isLoading,
}: DashboardMetricsSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Credit Usage History</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => navigate('/dashboard/credits')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <CreditUsageChart />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => navigate('/dashboard/activity')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <UserActivityFeed 
          activities={activities}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};
