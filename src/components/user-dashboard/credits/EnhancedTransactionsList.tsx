
import React, { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { handleSupabaseError } from '@/utils/errorHandling';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  agent?: {
    id: string;
    title: string;
  };
  payment_intent_id?: string;
  metadata?: {
    type?: string;
    [key: string]: any;
  };
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('User not authenticated');
        }

        let query = supabase
          .from('transactions')
          .select(`
            *,
            agent:agent_id (
              id,
              title
            )
          `, { count: 'exact' })
          .eq('user_id', userData.user.id)
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
          .order('created_at', { ascending: false });

        // Apply status filter if selected
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        // Apply transaction type filter if selected
        if (transactionType !== 'all') {
          query = query.contains('metadata', { type: transactionType });
        }

        const { data, error, count } = await query;

        if (error) {
          handleSupabaseError(error, { operation: 'fetchTransactions', resource: 'transactions' });
          throw error;
        }

        if (count !== null) {
          setTotalCount(count);
        }

        // If no transactions found, use mock data
        if (!data || data.length === 0) {
          console.log('No transactions found, using mock data');
          const mockTransactions: Transaction[] = [
            {
              id: 'txn-1',
              amount: 29.99,
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
              agent: { id: 'agent-1', title: 'Customer Support Pro' },
              metadata: { type: 'purchase' }
            },
            {
              id: 'txn-2',
              amount: 49.99,
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
              agent: { id: 'agent-2', title: 'Data Insights Engine' },
              metadata: { type: 'purchase' }
            },
            {
              id: 'txn-3',
              amount: 20.00,
              status: 'pending',
              created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              agent: { id: 'agent-3', title: 'Content Creator' },
              metadata: { type: 'purchase' }
            },
            {
              id: 'txn-4',
              amount: 10.00,
              status: 'failed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              agent: { id: 'agent-4', title: 'Code Assistant Pro' },
              metadata: { type: 'purchase' }
            },
            {
              id: 'txn-5',
              amount: 15.00,
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
              metadata: { type: 'credit_purchase' }
            }
          ];
          setTransactions(mockTransactions);
          setTotalCount(mockTransactions.length);
        } else {
          // Convert string status to Transaction status type
          const typedTransactions = data.map(tx => ({
            ...tx,
            status: (tx.status as 'pending' | 'completed' | 'failed') || 'pending'
          })) as Transaction[];
          
          setTransactions(typedTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Failed to load transactions",
          description: "There was a problem loading your transaction history. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, statusFilter, transactionType, toast]);

  // Filter transactions by search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return transactions.filter(transaction => 
      transaction.agent?.title?.toLowerCase().includes(normalizedQuery) ||
      transaction.id.toLowerCase().includes(normalizedQuery) ||
      (transaction.payment_intent_id && transaction.payment_intent_id.toLowerCase().includes(normalizedQuery))
    );
  }, [transactions, searchQuery]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionTypeLabel = (transaction: Transaction) => {
    const type = transaction.metadata?.type;
    
    if (type === 'purchase') {
      return 'Agent Purchase';
    } else if (type === 'credit_purchase') {
      return 'Credit Purchase';
    } else if (type === 'subscription') {
      return 'Subscription';
    } else {
      return 'Other';
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Transaction History</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase">Agent Purchase</SelectItem>
              <SelectItem value="credit_purchase">Credit Purchase</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex flex-col sm:flex-row justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {transaction.agent?.title || getTransactionTypeLabel(transaction)}
                    </span>
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span>ID: {transaction.id.slice(0, 8)}...</span>
                    <span className="hidden sm:inline text-muted-foreground">•</span>
                    <span>{formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <div className={`font-medium ${transaction.status === 'failed' ? "text-red-600" : "text-green-600"}`}>
                    ${transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getTransactionTypeLabel(transaction)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="h-9 w-9"
                    aria-label="Previous page"
                  >
                    <PaginationPrevious className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNumber: number;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <Button
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(pageNumber)}
                        className="h-9 w-9"
                        aria-label={`Page ${pageNumber}`}
                      >
                        {pageNumber}
                      </Button>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="h-9 w-9"
                    aria-label="Next page"
                  >
                    <PaginationNext className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;
