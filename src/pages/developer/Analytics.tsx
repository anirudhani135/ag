import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "@/components/developer/analytics/AnalyticsDashboard";
import { UserEngagementMetrics } from "@/components/developer/analytics/UserEngagementMetrics";
import { GeographicDistribution } from "@/components/developer/analytics/GeographicDistribution";

const Analytics = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Monitor your API performance and user engagement metrics
            </p>
          </div>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api">API Analytics</TabsTrigger>
            <TabsTrigger value="users">User Engagement</TabsTrigger>
            <TabsTrigger value="geo">Geographic</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserEngagementMetrics />
          </TabsContent>

          <TabsContent value="geo" className="space-y-6">
            <GeographicDistribution />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
