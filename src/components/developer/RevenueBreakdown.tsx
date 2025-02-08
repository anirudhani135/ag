
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { subscribeToRevenue } from "@/lib/realtimeSubscriptions";
import { Alert } from "@/components/ui/alert";

interface RevenueData {
  name: string;
  revenue: number;
  transactions: number;
}

export const RevenueBreakdown = () => {
  const [realtimeData, setRealtimeData] = useState<RevenueData[]>([]);

  const { data: revenueData, isLoading, error } = useQuery({
    queryKey: ['developer', 'revenue-breakdown'],
    queryFn: async () => {
      console.log('Fetching revenue breakdown...');
      const { data: analyticsData, error } = await supabase
        .from('revenue_analytics')
        .select('*')
        .order('hour', { ascending: false })
        .limit(24);

      if (error) {
        console.error('Error fetching revenue:', error);
        throw error;
      }

      return analyticsData.map(row => ({
        name: new Date(row.hour).toLocaleTimeString([], { hour: '2-digit' }),
        revenue: parseFloat(row.total_revenue.toString()),
        transactions: row.transaction_count
      }));
    }
  });

  useEffect(() => {
    const channel = subscribeToRevenue((payload) => {
      if (payload.new && revenueData) {
        setRealtimeData([...revenueData]);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [revenueData]);

  const displayData = realtimeData.length ? realtimeData : revenueData || [];

  if (error) {
    return (
      <Alert variant="destructive">
        <p>Error loading revenue data. Please try again later.</p>
      </Alert>
    );
  }

  const totalRevenue = displayData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = displayData.reduce((sum, item) => sum + item.transactions, 0);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
          <p className="text-sm text-muted-foreground">Last 24 hours</p>
        </div>
        <DollarSign className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Transactions</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalTransactions}</p>
        </div>
      </div>

      <div className="h-[300px]">
        {isLoading ? (
          <div className="h-full w-full bg-muted animate-pulse rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#666' }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
