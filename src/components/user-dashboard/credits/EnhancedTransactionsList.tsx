import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationButton } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarIcon, CreditCard, Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

interface TransactionData {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  payment_method?: string;
  description?: string;
  type?: string;
  metadata?: any;
}

export function EnhancedTransactionsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch transactions with React Query
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", filter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (error) throw error;
      return data as TransactionData[];
    },
    // Remove keepPreviousData as it's deprecated in React Query v5
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get total transactions count for pagination
  const { data: totalCount } = useQuery({
    queryKey: ["transactions-count", filter],
    queryFn: async () => {
      let query = supabase.from("transactions").select("id", { count: "exact" });
      if (filter !== "all") {
        query = query.eq("status", filter);
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (!searchTerm.trim()) return transactions;

    return transactions.filter((transaction) => {
      const searchFields = [
        transaction.id,
        transaction.status,
        transaction.payment_method,
        transaction.description,
        transaction.type,
      ];
      
      return searchFields.some(
        (field) => field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [transactions, searchTerm]);

  const totalPages = useMemo(() => {
    return totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;
  }, [totalCount]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleExport = () => {
    if (!transactions) return;
    
    // Create CSV string
    const headers = ["ID", "Date", "Amount", "Status", "Type", "Description"];
    const csvRows = [headers.join(",")];
    
    transactions.forEach((transaction) => {
      const row = [
        transaction.id,
        new Date(transaction.created_at).toLocaleString(),
        transaction.amount,
        transaction.status,
        transaction.type || "purchase",
        transaction.description || "",
      ];
      
      csvRows.push(row.join(","));
    });
    
    const csvString = csvRows.join("\n");
    
    // Create download link
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            There was an error loading transactions. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-4">
        <CardTitle>Transaction History</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-9"
            onClick={handleExport}
            disabled={!transactions?.length}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-y gap-2 sm:gap-0">
          <div className="relative w-full sm:w-auto flex-1 sm:max-w-[250px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8 w-full max-w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col xs:flex-row w-full sm:w-auto items-center justify-end gap-2">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="h-9 w-full sm:w-[130px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transaction list */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 px-4 text-muted-foreground">
            No transactions found. Try adjusting your filters.
          </div>
        ) : (
          <>
            <div className="overflow-auto">
              <div className="rounded-md">
                {/* Desktop view */}
                <table className="w-full hidden md:table">
                  <thead className="bg-muted/50">
                    <tr className="text-sm font-medium text-left">
                      <th className="px-4 py-3 text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-muted-foreground">ID</th>
                      <th className="px-4 py-3 text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDistance(new Date(transaction.created_at), new Date(), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                          {transaction.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3 font-medium">${transaction.amount}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {transaction.type ||
                                (transaction.metadata?.type) ||
                                "Purchase"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize",
                              transaction.status === "completed" && "border-green-500 text-green-600 bg-green-50",
                              transaction.status === "pending" && "border-yellow-500 text-yellow-600 bg-yellow-50",
                              transaction.status === "failed" && "border-red-500 text-red-600 bg-red-50"
                            )}
                          >
                            {transaction.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Mobile view */}
                <div className="md:hidden divide-y">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">
                          ${transaction.amount}
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            transaction.status === "completed" && "border-green-500 text-green-600 bg-green-50",
                            transaction.status === "pending" && "border-yellow-500 text-yellow-600 bg-yellow-50",
                            transaction.status === "failed" && "border-red-500 text-red-600 bg-red-50"
                          )}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {formatDistance(new Date(transaction.created_at), new Date(), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          <span>
                            {transaction.type ||
                              (transaction.metadata?.type) ||
                              "Purchase"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">
                        ID: {transaction.id.slice(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center p-4 border-t">
                <div className="flex gap-1">
                  <PaginationButton
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </PaginationButton>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationButton disabled className="cursor-default">
                            ...
                          </PaginationButton>
                        )}
                        <PaginationButton
                          onClick={() => handlePageChange(page)}
                          active={page === currentPage}
                        >
                          {page}
                        </PaginationButton>
                      </React.Fragment>
                    ))}
                  <PaginationButton
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </PaginationButton>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
