
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  XCircle, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Tag
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/shared/filters/DateRangePicker";
import { motion, AnimatePresence } from "framer-motion";

interface DeploymentLog {
  id: string;
  deployment_id: string;
  environment_id: string | null;
  logs: string | null;
  metadata: Json | null;
  created_at: string | null;
  status: string;
}

interface DeploymentLogsProps {
  agentId: string;
  className?: string;
}

export const DeploymentLogs = ({ agentId, className }: DeploymentLogsProps) => {
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<DeploymentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set());
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const autoRefreshIntervalRef = useRef<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Handle auto-refresh
  useEffect(() => {
    if (isAutoRefresh) {
      autoRefreshIntervalRef.current = window.setInterval(() => {
        fetchLogs();
      }, 5000) as unknown as number;
    } else if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }
    
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [isAutoRefresh, agentId]);

  // Fetch logs
  const fetchLogs = async () => {
    if (!agentId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('deployment_logs')
        .select('*')
        .eq('deployment_id', agentId)
        .order('created_at', { ascending: sortDirection === 'asc' })
        .limit(100);

      if (error) throw error;
      if (data) {
        setLogs(data as DeploymentLog[]);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and setup subscription
  useEffect(() => {
    fetchLogs();

    // Subscribe to real-time log updates
    const channel = supabase
      .channel('deployment-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deployment_logs',
          filter: `deployment_id=eq.${agentId}`
        },
        (payload) => {
          const newLog = payload.new as DeploymentLog;
          setLogs(current => {
            const updated = sortDirection === 'desc' 
              ? [newLog, ...current] 
              : [...current, newLog];
            return updated.slice(0, 100);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId, sortDirection]);

  // Apply filters when logs, search query, status filters, or date range change
  useEffect(() => {
    let filtered = [...logs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        (log.logs && log.logs.toLowerCase().includes(query)) ||
        (log.status && log.status.toLowerCase().includes(query))
      );
    }
    
    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter(log => 
        statusFilters.includes(log.status.toLowerCase())
      );
    }
    
    // Apply date range filter
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(log => {
        if (!log.created_at) return false;
        const logDate = new Date(log.created_at);
        
        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          return logDate >= fromDate && logDate <= toDate;
        }
        
        return logDate >= fromDate;
      });
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchQuery, statusFilters, dateRange]);

  // Toggle log expansion
  const toggleLogExpansion = (id: string) => {
    setExpandedLogIds(prevState => {
      const newState = new Set(prevState);
      if (newState.has(id)) {
        newState.delete(id);
      } else {
        newState.add(id);
      }
      return newState;
    });
  };

  // Get all available log statuses
  const getAvailableStatuses = () => {
    const statuses = new Set<string>();
    logs.forEach(log => {
      if (log.status) {
        statuses.add(log.status.toLowerCase());
      }
    });
    return Array.from(statuses);
  };

  // Handle status filter changes
  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setDateRange(undefined);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    
    // Re-fetch with new sort direction
    fetchLogs();
  };

  // Download logs as JSON
  const downloadLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `deployment-logs-${agentId}-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  const getLogLevelColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLogLevelIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-medium">Deployment Logs</h3>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="h-8"
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            {isAutoRefresh ? "Auto-refreshing" : "Auto-refresh"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadLogs}
            className="h-8"
            disabled={filteredLogs.length === 0}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />
                Status
                {statusFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{statusFilters.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {getAvailableStatuses().map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilters.includes(status)}
                  onCheckedChange={() => toggleStatusFilter(status)}
                >
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "mr-2 text-white",
                      getLogLevelColor(status)
                    )}
                  >
                    {status}
                  </Badge>
                </DropdownMenuCheckboxItem>
              ))}
              {getAvailableStatuses().length === 0 && (
                <DropdownMenuItem disabled>
                  No statuses available
                </DropdownMenuItem>
              )}
              {statusFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilters([])}>
                    Clear status filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="h-4 w-4 mr-1" />
                Date
                {dateRange && <Badge variant="secondary" className="ml-1">Set</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3">
                <DateRangePicker
                  date={dateRange}
                  onChange={setDateRange}
                />
                {dateRange && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setDateRange(undefined)}
                    className="mt-2 w-full"
                  >
                    Clear Date Filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSortDirection}
            className="h-9"
          >
            {sortDirection === 'desc' ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Newest
              </>
            ) : (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Oldest
              </>
            )}
          </Button>
          
          {(searchQuery || statusFilters.length > 0 || dateRange) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="h-[500px] border rounded-md">
        <div className="p-1">
          <AnimatePresence initial={false}>
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2"
                >
                  <div
                    className={cn(
                      "text-sm font-mono p-3 rounded bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer",
                      expandedLogIds.has(log.id) && "bg-muted/70"
                    )}
                    onClick={() => toggleLogExpansion(log.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-white flex items-center gap-1",
                            getLogLevelColor(log.status)
                          )}
                        >
                          {getLogLevelIcon(log.status)}
                          <span className="uppercase text-xs">{log.status}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                          {log.created_at && format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                        <span className="text-xs text-muted-foreground sm:hidden">
                          {log.created_at && format(new Date(log.created_at), 'MM/dd HH:mm')}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        {expandedLogIds.has(log.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLogIds.has(log.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="mt-2 border-t pt-2 border-border">
                            <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-[500px] p-2 bg-background rounded">
                              {log.logs || 'No log content'}
                            </pre>
                            
                            {log.metadata && (
                              <div className="mt-2 pt-2 border-t border-border">
                                <details className="text-xs">
                                  <summary className="cursor-pointer font-semibold">Metadata</summary>
                                  <pre className="mt-1 p-2 bg-background rounded overflow-auto">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </details>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No logs available</p>
                {(searchQuery || statusFilters.length > 0 || dateRange) && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">No logs match your filter criteria</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Card>
  );
};
