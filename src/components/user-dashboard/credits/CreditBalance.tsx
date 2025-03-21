
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export const CreditBalance = () => {
  const { user } = useAuth();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!user) {
        return { credit_balance: 0, last_credit_purchase: null };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('credit_balance, last_credit_purchase')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    // Don't retry if user isn't authenticated
    retry: user ? 2 : 0
  });

  // Determine color based on balance
  const getBalanceColor = (balance: number) => {
    if (balance > 100) return "text-green-600";
    if (balance > 20) return "text-blue-600";
    return "text-orange-500";
  };

  return (
    <Card className="border border-border overflow-hidden transition-all duration-200 hover:shadow-md group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-blue-50 to-white">
        <CardTitle className="text-sm font-medium">
          Available Credits
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Coins className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-2" />
        ) : (
          <div className={cn("text-2xl font-bold transition-colors", 
            getBalanceColor(profile?.credit_balance || 0))}>
            {profile?.credit_balance || 0} credits
          </div>
        )}
        
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-xs text-muted-foreground">
            Credits can be used to access premium features
          </p>
          
          <div className="flex gap-2 mt-1">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs h-8 w-full justify-start bg-white border-blue-100 hover:bg-blue-50 hover:border-blue-200"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Add Credits
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-8 w-full justify-start hover:bg-gray-50"
            >
              <History className="h-3 w-3 mr-1" />
              History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
