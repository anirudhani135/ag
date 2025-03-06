
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface RequestData {
  time: string;
  requests: number;
}

export const RequestsChart = () => {
  const { data: requestData, isLoading } = useQuery({
    queryKey: ['api-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('timestamp, requests_count')
        .order('timestamp', { ascending: true })
        .limit(24);
      
      if (error) throw error;
      return data.map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        requests: d.requests_count
      })) as RequestData[];
    }
  });

  if (isLoading) {
    return <Card className="w-full h-[400px] animate-pulse" />;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Request Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={requestData || []}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="requests"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
