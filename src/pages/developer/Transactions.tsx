
import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import TransactionList from "@/components/user-dashboard/credits/EnhancedTransactionsList";
import { RealTimeMetrics } from "@/components/dashboard/RealTimeMetrics";
import { subscribeToTransactions } from "@/lib/realtimeSubscriptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityLogger";

export default function Transactions() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const { toast } = useToast();

  // Subscribe to transaction updates
  useEffect(() => {
    const channel = subscribeToTransactions((payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        setLastUpdated(new Date());
        setUpdateCount(prev => prev + 1);
        
        toast({
          title: "Transaction Updated",
          description: `A new transaction has been ${payload.eventType === 'INSERT' ? 'added' : 'updated'}.`,
        });
      }
    });

    // Log page view
    logActivity('agent_view', { page: 'Transactions' });

    return () => {
      channel.unsubscribe();
    };
  }, [toast]);

  const refreshData = async () => {
    try {
      await supabase.rest.realtime.setRealtimeSubscriptionEnabled(true, {
        table: "transactions",
        schema: "public"
      });
      
      setLastUpdated(new Date());
      toast({
        title: "Refreshed",
        description: "Transaction data has been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh transaction data.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
            <p className="text-muted-foreground">
              View and manage your transaction history
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {updateCount > 0 && (
              <Badge variant="secondary" className="px-2 py-1">
                {updateCount} update{updateCount !== 1 ? 's' : ''} since {lastUpdated?.toLocaleTimeString()}
              </Badge>
            )}
            
            <Button onClick={refreshData} size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <RealTimeMetrics />
        
        <TransactionList />
      </div>
    </DashboardLayout>
  );
}
