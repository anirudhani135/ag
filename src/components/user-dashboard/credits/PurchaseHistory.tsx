
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ResponsiveTable } from '@/components/shared/tables/ResponsiveTable';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  FileDown, 
  Filter, 
  Search, 
  SlidersHorizontal,
  Info,
  BarChart4,
  PieChart,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/shared/filters/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from 'framer-motion';

interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  description: string | null;
  transaction_type: string;
  user_id: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const PurchaseHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['purchase-history'],
    queryFn: fetchTransactions
  });

  // Filter transactions based on search, type, and date range
  const filteredTransactions = data.filter(transaction => {
    const matchesSearch = !searchTerm || 
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilters.length === 0 || typeFilters.includes(transaction.transaction_type);
    
    const matchesDateRange = !dateRange?.from || (
      transaction.created_at && 
      new Date(transaction.created_at) >= dateRange.from && 
      (!dateRange.to || new Date(transaction.created_at) <= dateRange.to)
    );
    
    return matchesSearch && matchesType && matchesDateRange;
  });

  // Get all unique transaction types
  const getTransactionTypes = () => {
    return Array.from(new Set(data.map(item => item.transaction_type)));
  };

  // Prepare data for bar chart (monthly summary)
  const prepareBarChartData = () => {
    if (filteredTransactions.length === 0) return [];
    
    const monthlyData = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at);
      const monthYear = format(date, 'MMM yyyy');
      
      if (!acc[monthYear]) {
        acc[monthYear] = { purchases: 0, usage: 0 };
      }
      
      if (transaction.transaction_type === 'purchase') {
        acc[monthYear].purchases += transaction.amount;
      } else {
        acc[monthYear].usage += Math.abs(transaction.amount);
      }
      
      return acc;
    }, {} as Record<string, { purchases: number; usage: number }>);
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      purchases: data.purchases,
      usage: data.usage
    }));
  };

  // Prepare data for pie chart (transaction type breakdown)
  const preparePieChartData = () => {
    if (filteredTransactions.length === 0) return [];
    
    const typeData = filteredTransactions.reduce((acc, transaction) => {
      const type = transaction.transaction_type;
      
      if (!acc[type]) {
        acc[type] = 0;
      }
      
      acc[type] += Math.abs(transaction.amount);
      
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeData).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Download transactions as CSV
  const downloadTransactions = () => {
    if (filteredTransactions.length === 0) return;
    
    const headers = ['Date', 'Type', 'Description', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        format(new Date(t.created_at), 'yyyy-MM-dd HH:mm:ss'),
        t.transaction_type,
        t.description || 'N/A',
        t.amount
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `credit-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
  };

  const columns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        const created_at = row.original.created_at;
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {created_at ? format(new Date(created_at), 'MMM d, yyyy') : '-'}
            </span>
            <span className="text-xs text-muted-foreground">
              {created_at ? format(new Date(created_at), 'h:mm a') : ''}
            </span>
            <span className="text-xs text-muted-foreground hidden md:block">
              {created_at ? formatDistanceToNow(new Date(created_at), { addSuffix: true }) : ''}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'transaction_type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.transaction_type;
        let color = '';
        let icon = null;
        
        switch(type) {
          case 'purchase':
            color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            break;
          case 'usage':
            color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            break;
          case 'refund':
            color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            break;
          case 'adjustment':
            color = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            break;
          default:
            color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
        
        return (
          <Badge variant="outline" className={`${color} capitalize py-0.5 px-2 font-medium text-xs transition-all duration-200 hover:scale-105`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.description || '-'}>
          {row.original.description || '-'}
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.original.amount;
        const isPositive = amount > 0 || row.original.transaction_type === 'purchase';
        
        return (
          <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'} transition-all duration-200 hover:scale-105`}>
            {isPositive ? '+' : ''}{amount} credits
          </span>
        );
      },
      className: 'text-right'
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTransaction(row.original);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilters([]);
    setDateRange(undefined);
  };

  // Toggle a type filter
  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <CardTitle className="text-xl">Purchase History</CardTitle>
          
          <div className="flex flex-wrap gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-2">
              <TabsList className="h-8">
                <TabsTrigger value="list" className="text-xs px-3">
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                  List
                </TabsTrigger>
                <TabsTrigger value="chart" className="text-xs px-3">
                  <BarChart4 className="h-3.5 w-3.5 mr-1" />
                  Charts
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadTransactions}
              disabled={filteredTransactions.length === 0}
              className="h-8"
            >
              <FileDown className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
              className="h-8"
            >
              <svg
                className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 whitespace-nowrap">
                    <Filter className="h-4 w-4 mr-1" />
                    Type
                    {typeFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-1">{typeFilters.length}</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getTransactionTypes().map(type => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={typeFilters.includes(type)}
                      onCheckedChange={() => toggleTypeFilter(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {typeFilters.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setTypeFilters([])}>
                        Clear type filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DateRangePicker
                date={dateRange}
                onChange={setDateRange}
                className="w-auto"
              />
              
              {(searchTerm || typeFilters.length > 0 || dateRange) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <TabsContent value="list" className="m-0 mt-2">
              <motion.div
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ResponsiveTable
                  columns={columns}
                  data={filteredTransactions}
                  isLoading={isLoading}
                  noResultsMessage={
                    searchTerm || typeFilters.length > 0 || dateRange 
                      ? "No transactions match your filters" 
                      : "No purchase history available"
                  }
                  onRowClick={(row) => setSelectedTransaction(row)}
                  keyExtractor={(item) => item.id}
                />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="chart" className="m-0 mt-4">
              <motion.div
                key="chart-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h3 className="text-sm font-medium mb-4">Monthly Credit Transactions</h3>
                    <div className="h-[300px]">
                      {prepareBarChartData().length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={prepareBarChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <XAxis 
                              dataKey="month" 
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis />
                            <RechartsTooltip 
                              formatter={(value, name) => [`${value} credits`, name.charAt(0).toUpperCase() + name.slice(1)]}
                            />
                            <Bar dataKey="purchases" fill="#3B82F6" name="Purchases" />
                            <Bar dataKey="usage" fill="#10B981" name="Usage" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No data to display</p>
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium mb-4">Transaction Type Breakdown</h3>
                    <div className="h-[300px]">
                      {preparePieChartData().length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={preparePieChartData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {preparePieChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend 
                              formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                            />
                            <RechartsTooltip 
                              formatter={(value, name) => [`${value} credits`, name.charAt(0).toUpperCase() + name.slice(1)]}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No data to display</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-xs break-all">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p>{format(new Date(selectedTransaction.created_at), 'PPpp')}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {selectedTransaction.transaction_type}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedTransaction.description || 'No description available'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className={`text-xl font-bold ${selectedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedTransaction.amount > 0 ? '+' : ''}{selectedTransaction.amount} credits
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTransaction(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PurchaseHistory;
