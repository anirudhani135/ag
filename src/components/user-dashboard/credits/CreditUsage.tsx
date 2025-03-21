import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface CreditUsageProps {
  showDetailed?: boolean;
}

interface UsageBreakdown {
  service_name: string;
  amount: number;
}

export const CreditUsage = ({ showDetailed = false }: CreditUsageProps) => {
  const { user } = useAuth();
  
  const { data, isLoading } = useQuery({
    queryKey: ['credit-usage'],
    queryFn: async () => {
      if (!user) {
        return {
          balance: 0,
          limit: 1000,
          usage: 0,
          breakdown: []
        };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('credit_balance, credit_limit')
        .eq('id', user.id)
        .single();

      // Get credit usage
      const { data: usageData } = await supabase
        .from('credit_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // For detailed view, get usage breakdown
      let usageBreakdown: UsageBreakdown[] = [];
      if (showDetailed) {
        const { data: breakdown } = await supabase
          .from('credit_usage_breakdown')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        usageBreakdown = breakdown || [];
      }

      return {
        balance: profile?.credit_balance || 0,
        limit: profile?.credit_limit || 1000,
        usage: usageData?.amount || 0,
        breakdown: usageBreakdown
      };
    },
    retry: user ? 2 : 0
  });

  const usagePercentage = data ? (data.usage / data.limit) * 100 : 0;
  
  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 70) return "bg-blue-500";
    if (percentage < 90) return "bg-amber-500";
    return "bg-red-500";
  };

  if (showDetailed) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-white to-blue-50/50 pb-4">
          <CardTitle className="flex items-center text-lg">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            Credit Usage Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Usage this month</span>
                  <span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-mono",
                        usagePercentage > 90 ? "border-red-200 text-red-600" :
                        usagePercentage > 70 ? "border-amber-200 text-amber-600" :
                        "border-green-200 text-green-600"
                      )}
                    >
                      {data?.usage} / {data?.limit} credits
                    </Badge>
                  </span>
                </div>
                <Progress 
                  value={usagePercentage} 
                  className={cn("h-2", getProgressColor(usagePercentage))}
                />
                <p className="text-xs text-muted-foreground">
                  {usagePercentage > 90 
                    ? "You're almost at your limit! Consider purchasing more credits."
                    : usagePercentage > 70
                    ? "You're using credits at a good pace."
                    : "You have plenty of credits available."}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Usage by Service</h4>
                <div className="space-y-3">
                  {data?.breakdown && data.breakdown.length > 0 ? (
                    data.breakdown.map((item: UsageBreakdown, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span>{item.service_name}</span>
                          <span className="font-mono text-xs">{item.amount} credits</span>
                        </div>
                        <Progress 
                          value={(item.amount / data.usage) * 100} 
                          className={cn("h-1.5", `bg-blue-${300 + index * 100}`)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p>No usage data available yet</p>
                      <p className="text-sm mt-1">Start using our services to see your breakdown</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border overflow-hidden transition-all duration-200 hover:shadow-md group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-blue-50 to-white">
        <CardTitle className="text-sm font-medium">
          Credit Usage
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Zap className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium">Monthly Usage</span>
              <span className="text-xs font-mono">{data?.usage}/{data?.limit}</span>
            </div>
            <Progress 
              value={usagePercentage} 
              className={cn("h-2", getProgressColor(usagePercentage))}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {usagePercentage > 90 
                ? "Almost at limit!"
                : usagePercentage > 70
                ? "Using at a good pace"
                : "Plenty available"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
