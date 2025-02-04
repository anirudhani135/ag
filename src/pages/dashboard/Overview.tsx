import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Activity, 
  CreditCard, 
  Users, 
  Star, 
  Download, 
  Share2, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Globe
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState } from "react";

const DashboardOverview = () => {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("week");

  const { data: metricsData, isLoading: isMetricsLoading } = useQuery({
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
      title: "Total Revenue",
      value: "$12,345",
      icon: CreditCard,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: Users,
      change: "+3%",
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "2.4%",
      icon: Activity,
      change: "-0.5%",
      trend: "down",
    },
    {
      title: "Top Agents",
      value: "6",
      icon: Star,
      change: "+2",
      trend: "up",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
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
            data={metricsData?.map(d => ({
              date: format(new Date(d.date), "MMM d"),
              value: d.revenue || 0
            })) || []}
            title="Revenue Over Time"
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Geographic visualization coming soon
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performing Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isMetricsLoading ? (
                  <p className="text-muted-foreground">Loading agents...</p>
                ) : (
                  <div className="space-y-4">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Star className="h-5 w-5 text-accent" />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                User Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Average Session Duration</p>
                    <p className="text-2xl font-bold">12m 30s</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Peak Activity Hours</p>
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