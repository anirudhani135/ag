
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ActiveUserTrends } from "@/components/developer/ActiveUserTrends";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Monitoring = () => {
  const { data: performanceMetrics } = useQuery({
    queryKey: ['system-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_performance_metrics')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(24);

      if (error) throw error;
      return data.map(metric => ({
        time: new Date(metric.timestamp).toLocaleTimeString(),
        responseTime: metric.response_time,
        errorRate: metric.error_rate,
      }));
    },
  });

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">System Monitoring</h2>
        <p className="text-muted-foreground">
          Monitor your system's performance and health
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Response Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceMetrics || []}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Error Rate</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceMetrics || []}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="errorRate"
                    stroke="#ff4d4f"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <ActiveUserTrends />
      </div>
    </DashboardLayout>
  );
};

export default Monitoring;
