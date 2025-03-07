
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/shared/filters/DateRangePicker";
import { Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";

export const TransactionsList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', search, status, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          agents(title, id),
          profiles(email, name)
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`agents.title.ilike.%${search}%,profiles.email.ilike.%${search}%`);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
        
        if (dateRange.to) {
          query = query.lte('created_at', dateRange.to.toISOString());
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={status || ""} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.created_at)}</TableCell>
                      <TableCell>
                        {transaction.agents?.title || 'Unknown Agent'}
                      </TableCell>
                      <TableCell>{transaction.profiles?.email || 'Unknown User'}</TableCell>
                      <TableCell>${parseFloat(transaction.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === 'completed' ? 'success' :
                            transaction.status === 'pending' ? 'outline' :
                            transaction.status === 'failed' ? 'destructive' :
                            transaction.status === 'refunded' ? 'secondary' :
                            'default'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
