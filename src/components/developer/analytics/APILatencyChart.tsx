
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const APILatencyChart = () => {
  const { data: latencyData, isLoading } = useQuery({
    queryKey: ['api-latency'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('timestamp, response_time')
        .order('timestamp', { ascending: true })
        .limit(100);
      
      if (error) throw error;
      return data.map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        latency: d.response_time
      }));
    }
  });

  if (isLoading) {
    return <Card className="w-full h-[400px] animate-pulse" />;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>API Response Times</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData || []}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
