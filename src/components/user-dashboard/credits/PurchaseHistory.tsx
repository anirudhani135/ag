
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for the transaction data
interface Transaction {
  amount: number;
  created_at: string;
}

// Define explicit types for the query result
interface PurchaseData {
  latest: Transaction | null;
  totalPurchases: number;
}

// Define the query function without explicit return type annotation
// to avoid recursive type inference issues
const fetchPurchaseHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, created_at')
    .eq('user_id', user.id)
    .eq('type', 'credit_purchase')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  
  const { count } = await supabase
    .from('transactions')
    .select('amount', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('type', 'credit_purchase');

  return {
    latest: data && data.length > 0 ? data[0] : null,
    totalPurchases: count || 0
  };
};

export const PurchaseHistory = () => {
  // Use the query function without specifying complex generic types
  const { data, isLoading } = useQuery({
    queryKey: ['purchase-history'],
    queryFn: fetchPurchaseHistory
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="border border-border overflow-hidden transition-all duration-200 hover:shadow-md group col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-blue-50 to-white">
        <CardTitle className="text-sm font-medium">
          Purchase History
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Receipt className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        ) : data?.latest ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last purchase</span>
              <span className="text-sm font-medium">{formatDate(data.latest.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-medium">${data.latest.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total purchases</span>
              <span className="text-sm font-medium">{data.totalPurchases}</span>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs p-0 h-auto hover:bg-transparent hover:text-blue-600 flex items-center"
              >
                View all purchases
                <TrendingUp className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground text-sm">No purchase history available</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs h-8 border-blue-100 hover:bg-blue-50 hover:border-blue-200"
            >
              Purchase Credits
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
