
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/context/AuthContext';

// Define a simple Transaction interface without complex nesting
interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  metadata: {
    type?: string;
    description?: string;
    [key: string]: any;
  } | null;
}

export const PurchaseHistory = () => {
  const { user } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ['purchase-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('metadata->type', 'purchase')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      
      // Safely transform the data to match our interface
      const transactions: Transaction[] = [];
      
      for (const item of data || []) {
        transactions.push({
          id: item.id,
          amount: item.amount,
          created_at: item.created_at,
          status: item.status,
          metadata: typeof item.metadata === 'object' ? item.metadata : null
        });
      }
      
      return transactions;
    },
    retry: user ? 2 : 0
  });

  return (
    <Card className="border border-border overflow-hidden transition-all duration-200 hover:shadow-md group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-blue-50 to-white">
        <CardTitle className="text-sm font-medium">
          Recent Purchases
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <CreditCard className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No purchase history</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">
                    {transaction.amount} credits
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                    ${transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                    ${transaction.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                  `}
                >
                  {transaction.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
