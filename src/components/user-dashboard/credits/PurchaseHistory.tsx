
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Updated to make all fields optional except id, user_id, and amount
interface TransactionMetadata {
  timestamp?: string;
  paymentMethod?: string;
  status?: string;
  package?: string;
  type?: string;
  [key: string]: any;
}

interface RawTransaction {
  id: string;
  user_id: string;
  transaction_type?: string; // Made optional to accommodate database schema
  amount: number;
  created_at: string;
  metadata?: TransactionMetadata;
  agent_id?: string;
  status?: string;
  payment_intent_id?: string;
}

export function PurchaseHistory() {
  const [transactions, setTransactions] = useState<RawTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match our RawTransaction type
        const transformedData = data?.map((item: any) => ({
          ...item,
          transaction_type: item.metadata?.type || 'purchase' // Add missing transaction_type
        })) || [];
        
        setTransactions(transformedData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
        <CardDescription>View your past transactions and credit purchases.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="credits" className="space-y-4">
          <TabsList>
            <TabsTrigger value="credits" className="inline-flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Credit Purchases</span>
            </TabsTrigger>
            <TabsTrigger value="agent-usage" className="inline-flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Agent Usage</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="credits" className="space-y-4">
            {isLoading ? (
              <p>Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p>No credit purchases found.</p>
            ) : (
              <div className="grid gap-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          <DollarSign className="mr-2 inline-block h-4 w-4" />
                          {transaction.amount} Credits
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <Calendar className="mr-2 inline-block h-3 w-3" />
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{transaction.metadata?.paymentMethod || 'Credit Card'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Status: {transaction.metadata?.status || transaction.status || 'Completed'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="agent-usage">
            <p>No agent usage history available yet.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
