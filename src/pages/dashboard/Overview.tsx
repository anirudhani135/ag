import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Users, Star } from "lucide-react";

export const DashboardOverview = () => {
  const stats = [
    {
      title: "Total Credits",
      value: "1,234",
      icon: CreditCard,
      change: "+12%",
    },
    {
      title: "Active Agents",
      value: "12",
      icon: Users,
      change: "+3",
    },
    {
      title: "Usage This Month",
      value: "845",
      icon: Activity,
      change: "+20%",
    },
    {
      title: "Favorite Agents",
      value: "6",
      icon: Star,
      change: "+2",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-success">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Feed Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for activity items */}
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Agents Section */}
        <Card>
          <CardHeader>
            <CardTitle>Favorite Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for favorite agents */}
              <p className="text-muted-foreground">No favorite agents yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};