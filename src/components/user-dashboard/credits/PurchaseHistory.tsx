
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ResponsiveTable } from '@/components/shared/tables/ResponsiveTable';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  description: string | null;
  transaction_type: string;
  user_id: string;
}

export const PurchaseHistory = () => {
  const { toast } = useToast();

  const fetchTransactions = async (): Promise<Transaction[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching credit transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load purchase history',
        variant: 'destructive',
      });
      return [];
    }
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ['purchase-history'],
    queryFn: fetchTransactions
  });

  const columns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        const created_at = row.original.created_at;
        return created_at 
          ? formatDistanceToNow(new Date(created_at), { addSuffix: true }) 
          : '-';
      }
    },
    {
      accessorKey: 'transaction_type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.transaction_type;
        return (
          <span className={type === 'purchase' ? 'text-green-600' : 'text-blue-600'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        );
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => row.original.description || '-'
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.original.amount;
        const isPositive = amount > 0 || row.original.transaction_type === 'purchase';
        
        return (
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? '+' : ''}{amount} credits
          </span>
        );
      },
      className: 'text-right'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          noResultsMessage="No purchase history available"
          keyExtractor={(item) => item.id}
        />
      </CardContent>
    </Card>
  );
};

export default PurchaseHistory;
