
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CreditUsageChart = () => {
  const { data: creditHistory, isLoading } = useQuery({
    queryKey: ['credit-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data for chart
      return data.map(transaction => ({
        date: new Date(transaction.created_at).toLocaleDateString(),
        credits: transaction.amount,
        type: transaction.transaction_type
      }));
    },
  });

  if (isLoading) {
    return <Card className="p-6 h-[400px] flex items-center justify-center">Loading credit history...</Card>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Credit Usage History</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={creditHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="credits" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
