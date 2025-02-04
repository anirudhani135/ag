import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from "lucide-react";

export const ActiveUserTrends = () => {
  const { data: userTrends } = useQuery({
    queryKey: ['developer', 'user-trends'],
    queryFn: async () => {
      console.log('Fetching user trends...');
      const { data, error } = await supabase
        .from('platform_metrics')
        .select('metric_date, daily_active_users, new_users')
        .order('metric_date', { ascending: true })
        .limit(30);

      if (error) {
        console.error('Error fetching user trends:', error);
        throw error;
      }

      return data.map(item => ({
        date: new Date(item.metric_date).toLocaleDateString(),
        active: item.daily_active_users,
        new: item.new_users
      }));
    }
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Active User Trends</h3>
        <Users className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userTrends || []}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="active" stroke="#8884d8" name="Active Users" />
            <Line type="monotone" dataKey="new" stroke="#82ca9d" name="New Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};