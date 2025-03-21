
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
import { Loader2, Search, ArrowUpDown, CalendarRange } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const EnhancedTransactionsList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', search, status, dateRange, sortField, sortOrder, currentPage],
    queryFn: async () => {
      // Simulating pagination offset
      const offset = (currentPage - 1) * itemsPerPage;
      
      let query = supabase
        .from('transactions')
        .select(`
          *,
          agents(title, id),
          profiles(email, name)
        `, { count: 'exact' })
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(offset, offset + itemsPerPage - 1);

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

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { 
        transactions: data,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / itemsPerPage)
      };
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending for new field
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1 text-blue-600">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'outline';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-white to-blue-50/50 pb-4">
        <CardTitle className="flex items-center">
          <span>Transaction History</span>
        </CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select value={status || ""} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px] bg-white">
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
          <div className="flex items-center gap-2">
            <DateRangePicker 
              date={dateRange} 
              onChange={setDateRange} 
              className="w-auto bg-white"
            />
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                setSearch("");
                setStatus(null);
                setDateRange(undefined);
                setSortField("created_at");
                setSortOrder("desc");
                setCurrentPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => toggleSort('created_at')}
                    >
                      <span className="flex items-center">
                        Date {getSortIcon('created_at')}
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => toggleSort('agents.title')}
                    >
                      <span className="flex items-center">
                        Agent {getSortIcon('agents.title')}
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => toggleSort('profiles.email')}
                    >
                      <span className="flex items-center">
                        Customer {getSortIcon('profiles.email')}
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => toggleSort('amount')}
                    >
                      <span className="flex items-center">
                        Amount {getSortIcon('amount')}
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => toggleSort('status')}
                    >
                      <span className="flex items-center">
                        Status {getSortIcon('status')}
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.transactions && data.transactions.length > 0 ? (
                    data.transactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
                            {formatDate(transaction.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.agents?.title || 'Unknown Agent'}
                        </TableCell>
                        <TableCell>{transaction.profiles?.email || 'Unknown User'}</TableCell>
                        <TableCell className="font-semibold">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getBadgeVariant(transaction.status)}
                            className="transition-all hover:scale-105"
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-10 w-10 text-muted-foreground/50" />
                          <p className="text-base">No transactions found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => {
                              setSearch("");
                              setStatus(null);
                              setDateRange(undefined);
                            }}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {data?.transactions && data.transactions.length > 0 && (
              <div className="py-4 px-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                      // Show first page, last page, current page, and pages around current
                      let pageToShow: number | null = null;
                      
                      if (i === 0) {
                        pageToShow = 1;
                      } else if (i === 4 && data.totalPages > 5) {
                        pageToShow = data.totalPages;
                      } else if (data.totalPages <= 5) {
                        pageToShow = i + 1;
                      } else {
                        // Middle pages logic
                        const middleIndex = 2;
                        if (i === middleIndex) {
                          pageToShow = currentPage;
                        } else if (i === middleIndex - 1) {
                          pageToShow = currentPage > 2 ? currentPage - 1 : null;
                        } else if (i === middleIndex + 1) {
                          pageToShow = currentPage < data.totalPages - 1 ? currentPage + 1 : null;
                        }
                      }
                      
                      if (pageToShow === null) {
                        return (
                          <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      return (
                        <PaginationItem key={pageToShow}>
                          <PaginationLink 
                            isActive={currentPage === pageToShow}
                            onClick={() => setCurrentPage(pageToShow as number)}
                          >
                            {pageToShow}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(data.totalPages, p + 1))}
                        className={currentPage === data.totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
