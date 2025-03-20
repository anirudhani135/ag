
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { DashboardStatsGrid } from "@/components/dashboard/DashboardStatsGrid";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UserActivityFeed } from "@/components/dashboard/UserActivityFeed";
import { UserMetricsPanel } from "@/components/dashboard/UserMetricsPanel";
import { NotificationsCenter } from "@/components/dashboard/NotificationsCenter"; 

const performanceData = [
  { date: "Jan", value: 200 },
  { date: "Feb", value: 150 },
  { date: "Mar", value: 320 },
  { date: "Apr", value: 280 },
  { date: "May", value: 420 },
  { date: "Jun", value: 380 },
  { date: "Jul", value: 490 }
];

const Dashboard = () => {
  return (
    <DashboardLayout type="user">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your account.
          </p>
        </div>

        <DashboardStatsGrid 
          creditBalance={2500}
          activeAgents={3}
          monthlyUsage={124}
          averageRating={4.5}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <PerformanceChart 
              data={performanceData}
              title="Performance Over Time"
            />
          </Card>
          <Card className="lg:col-span-3">
            <QuickActions type="user" />
          </Card>
        </div>
        
        <UserMetricsPanel />

        <div className="grid gap-6 md:grid-cols-2">
          <UserActivityFeed />
          <NotificationsCenter />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
