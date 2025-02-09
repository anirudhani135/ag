
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/tables/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  payment_intent_id: string;
  profiles: {
    email: string;
  } | null;
}

interface TransactionListProps {
  startDate: Date;
  endDate: Date;
}

export const TransactionList = ({ startDate, endDate }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.created_at), "MMM d, yyyy HH:mm"),
    },
    {
      accessorKey: "profiles.email",
      header: "User",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `$${row.original.amount.toLocaleString()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${row.original.status === 'completed' ? 'bg-green-100 text-green-800' :
          row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "payment_intent_id",
      header: "Transaction ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.payment_intent_id}</span>
      ),
    },
  ];

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', startDate, endDate, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (email)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`user_id.ilike.%${searchTerm}%,payment_intent_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const exportTransactions = () => {
    if (!transactions) return;
    
    const csv = [
      ['Date', 'User', 'Amount', 'Status', 'Transaction ID'].join(','),
      ...transactions.map(t => [
        format(new Date(t.created_at), 'yyyy-MM-dd HH:mm:ss'),
        t.profiles?.email,
        t.amount,
        t.status,
        t.payment_intent_id
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={transactions || []}
        isLoading={isLoading}
        noResultsMessage="No transactions found for the selected date range."
      />
    </div>
  );
};
