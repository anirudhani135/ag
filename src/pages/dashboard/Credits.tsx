
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, ArrowUp, ArrowDown } from 'lucide-react';

interface CreditTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

const Credits = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['credit-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CreditTransaction[];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('credit_balance')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Credits</h2>
          <p className="text-muted-foreground">Manage your credit balance and view transaction history</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">{profile?.credit_balance || 0} Credits</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <ScrollArea className="h-[400px] w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading transactions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {transaction.transaction_type === 'credit' ? (
                        <ArrowUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.transaction_type === 'credit' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.transaction_type === 'credit' ? '+' : '-'}{transaction.amount}
                    </p>
                  </div>
                ))}
                {!transactions?.length && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transaction history available</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Credits;
