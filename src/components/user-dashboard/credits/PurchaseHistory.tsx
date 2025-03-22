
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/context/MockAuthContext';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

// Define the transaction interface
interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  description: string;
  type: string;
}

// Define the raw transaction data structure from Supabase
interface TransactionMetadata {
  type?: string;
  description?: string;
}

interface RawTransaction {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  metadata: TransactionMetadata | null;
}

export const PurchaseHistory = () => {
  const { user } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ['purchase-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, created_at, status, metadata')
        .eq('user_id', user.id)
        .eq('metadata->type', 'purchase')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      
      // Transform data with proper typing
      const transactions = (data as RawTransaction[] || []).map(item => ({
        id: item.id,
        amount: item.amount,
        created_at: item.created_at,
        status: item.status,
        type: item.metadata?.type || 'purchase',
        description: item.metadata?.description || `Purchase ${item.id.substring(0, 8)}`
      }));
      
      return transactions;
    },
    retry: user ? 2 : 0
  });

  return (
    <Card className="border border-border overflow-hidden transition-all duration-300 hover:shadow-md group animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-blue-50 to-white">
        <CardTitle className="text-sm font-medium">
          Recent Purchases
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <CreditCard className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No purchase history</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-muted/10 px-2 rounded-md transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">
                    {transaction.amount} credits
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <StatusBadge status={transaction.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
