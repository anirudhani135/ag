import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export const RevenueBreakdown = () => {
  const { data: revenueData } = useQuery({
    queryKey: ['developer', 'revenue-breakdown'],
    queryFn: async () => {
      console.log('Fetching revenue breakdown...');
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          amount,
          agent:agents(
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching revenue:', error);
        throw error;
      }

      // Group by agent and sum amounts
      const groupedData = data.reduce((acc: any[], curr) => {
        const agentTitle = curr.agent?.title || 'Unknown';
        const existing = acc.find(item => item.name === agentTitle);
        if (existing) {
          existing.revenue += curr.amount;
        } else {
          acc.push({ name: agentTitle, revenue: curr.amount });
        }
        return acc;
      }, []);

      return groupedData;
    }
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Revenue by Agent</h3>
        <DollarSign className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData || []}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};