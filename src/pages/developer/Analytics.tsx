
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "@/components/developer/analytics/AnalyticsDashboard";
import { UserEngagementMetrics } from "@/components/developer/analytics/UserEngagementMetrics";
import { GeographicDistribution } from "@/components/developer/analytics/GeographicDistribution";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  Download,
  RefreshCw
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { MetricExplanationTooltip } from "@/components/developer/analytics/MetricExplanationTooltip";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const handleRefresh = () => {
    setLastRefreshed(new Date());
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                Monitor your API performance and user engagement metrics
              </p>
              <MetricExplanationTooltip
                title="About Analytics"
                description="Analytics help you understand your agents' performance and usage patterns. Use these insights to optimize your agents and improve user experience."
              >
                <span className="sr-only">More info</span>
              </MetricExplanationTooltip>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </div>
            <Button size="sm" variant="outline" onClick={handleRefresh} className="gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant={timeRange === '24h' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTimeRange('24h')}
                className="gap-1"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>24 Hours</span>
              </Button>
              <Button 
                variant={timeRange === '7d' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTimeRange('7d')}
                className="gap-1"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>7 Days</span>
              </Button>
              <Button 
                variant={timeRange === '30d' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTimeRange('30d')}
                className="gap-1"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>30 Days</span>
              </Button>
              <Button 
                variant={timeRange === '90d' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTimeRange('90d')}
                className="gap-1"
              >
                <CalendarRange className="h-3.5 w-3.5" />
                <span>90 Days</span>
              </Button>
            </div>
            <div className="text-sm">
              Showing data for: <strong>{timeRange === '24h' ? 'Last 24 hours' : 
                                        timeRange === '7d' ? 'Last 7 days' : 
                                        timeRange === '30d' ? 'Last 30 days' : 
                                        'Last 90 days'}</strong>
            </div>
          </div>
        </Card>

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
