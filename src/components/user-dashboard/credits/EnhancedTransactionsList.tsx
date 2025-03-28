
import { useState, useCallback, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// Interface for transaction data with all optional fields except id
interface TransactionData {
  id: string;
  user_id: string;
  agent_id?: string;
  amount: number;
  metadata?: Record<string, any> | null;
  created_at: string;
  status: string;
  payment_intent_id?: string;
  // Virtual properties added in transformation
  type?: string;
  description?: string;
}

// Optimized table row component
const TransactionRow = memo(({ transaction, getStatusColor }: { 
  transaction: TransactionData;
  getStatusColor: (status: string) => string;
}) => (
  <TableRow key={transaction.id}>
    <TableCell className="font-medium">
      {format(new Date(transaction.created_at), "MMM d, yyyy")}
    </TableCell>
    <TableCell>{transaction.description}</TableCell>
    <TableCell className="capitalize">{transaction.type}</TableCell>
    <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
      {transaction.amount > 0 ? "+" : ""}{transaction.amount} credits
    </TableCell>
    <TableCell>
      <Badge variant="outline" className={cn("capitalize", getStatusColor(transaction.status))}>
        {transaction.status}
      </Badge>
    </TableCell>
  </TableRow>
));

TransactionRow.displayName = 'TransactionRow';

// Mobile card component
const TransactionCard = memo(({ transaction, getStatusColor }: {
  transaction: TransactionData;
  getStatusColor: (status: string) => string;
}) => (
  <Card className="mb-3">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(transaction.created_at), "MMM d, yyyy")}
          </p>
        </div>
        <Badge variant="outline" className={cn("capitalize", getStatusColor(transaction.status))}>
          {transaction.status}
        </Badge>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm capitalize">{transaction.type}</span>
        <span className={transaction.amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
          {transaction.amount > 0 ? "+" : ""}{transaction.amount} credits
        </span>
      </div>
    </CardContent>
  </Card>
));

TransactionCard.displayName = 'TransactionCard';

// Main component 
export const EnhancedTransactionsList = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", user?.id, sortOrder, statusFilter, typeFilter],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from("transactions")
        .select("id, user_id, agent_id, amount, metadata, created_at, status, payment_intent_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: sortOrder === "asc" });
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      // Modified type filter to check metadata->type safely
      if (typeFilter !== "all" && typeFilter) {
        query = query.eq("metadata->>type", typeFilter);
      }
      
      // Limit results for better performance
      query = query.limit(100);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to add virtual properties
      return (data || []).map((tx: any): TransactionData => {
        const metadataObj = typeof tx.metadata === 'object' ? tx.metadata : {};
        return {
          ...tx,
          // Extract type from metadata or provide default
          type: metadataObj.type || 'unknown',
          // Create a description from metadata or provide default
          description: metadataObj.description || `Transaction ${tx.id.substring(0, 8)}`
        };
      });
    },
    keepPreviousData: true,
    enabled: !!user,
    staleTime: 30000 // 30 seconds before refetching
  });
  
  // Optimized search filter
  const filteredTransactions = useCallback(() => {
    if (!transactions) return [];
    if (!searchQuery) return transactions;
    
    const query = searchQuery.toLowerCase();
    return transactions.filter(tx => 
      (tx.description && tx.description.toLowerCase().includes(query)) ||
      (tx.id && tx.id.toLowerCase().includes(query))
    );
  }, [transactions, searchQuery]);

  // Get status badge color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  }, []);

  const filtered = filteredTransactions();

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        {/* Responsive filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleSortOrder}
              title={`Sort by date ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            <div className="md:hidden">
              {filtered.map(transaction => (
                <TransactionCard 
                  key={transaction.id} 
                  transaction={transaction} 
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
            
            {/* Desktop view */}
            <div className="hidden md:block rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(transaction => (
                    <TransactionRow 
                      key={transaction.id} 
                      transaction={transaction} 
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Simplified TransactionList component for reuse
export const TransactionList = memo(EnhancedTransactionsList);
TransactionList.displayName = 'TransactionList';
