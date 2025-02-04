import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Code2, 
  CreditCard, 
  Users, 
  Star, 
  Download, 
  Share2, 
  TrendingUp, 
  TrendingDown,
  GitBranch,
  Box,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState } from "react";

const DashboardOverview = () => {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("week");

  const { data: agentMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['agent-metrics', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    {
      title: "Total Agent Revenue",
      value: "$12,345",
      icon: CreditCard,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Agents",
      value: "8",
      icon: Box,
      change: "+2",
      trend: "up",
    },
    {
      title: "Deployment Rate",
      value: "94%",
      icon: GitBranch,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Agent Rating",
      value: "4.8",
      icon: Star,
      change: "+0.2",
      trend: "up",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Last updated: {format(new Date(), "MMM d, yyyy HH:mm")}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-background rounded-lg border p-1">
              {["today", "week", "month", "custom"].map((period) => (
                <Button
                  key={period}
                  variant={dateRange === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDateRange(period as typeof dateRange)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={
                <span className={`flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-success' : 'text-error'
                }`}>
                  {stat.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  {stat.change}
                </span>
              }
              className="hover:border-accent transition-colors"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart
            data={agentMetrics?.map(d => ({
              date: format(new Date(d.date), "MMM d"),
              value: d.revenue || 0
            })) || []}
            title="Agent Revenue Over Time"
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Agent Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isMetricsLoading ? (
                  <p className="text-muted-foreground">Loading metrics...</p>
                ) : (
                  <div className="space-y-4">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Code2 className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Agent {i}</p>
                            <p className="text-sm text-muted-foreground">Performance score: {95 - i * 5}%</p>
                          </div>
                        </div>
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Recent Deployments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Box className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Agent Deployment v1.{i}</p>
                        <p className="text-sm text-muted-foreground">Deployed {i} day{i !== 1 ? 's' : ''} ago</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">Success</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total API Calls</p>
                    <p className="text-2xl font-bold">234,567</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-accent" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">API Usage by Hour</p>
                  <div className="h-24 flex items-end gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-accent/10 rounded-t"
                        style={{
                          height: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12 AM</span>
                    <span>12 PM</span>
                    <span>11 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;