
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStatsGrid } from "@/components/dashboard/DashboardStatsGrid";
import { CreditUsageChart } from "@/components/dashboard/CreditUsageChart";
import { UserActivityFeed } from "@/components/dashboard/UserActivityFeed";
import { NotificationsCenter } from "@/components/dashboard/NotificationsCenter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['user-dashboard-overview', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('credit_balance, credit_limit')
        .eq('id', user.id)
        .single();
      
      // Get active agents count
      const { count: activeAgents } = await supabase
        .from('saved_agents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      // Get monthly usage from credit_usage
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const { data: usageData } = await supabase
        .from('credit_usage')
        .select('amount')
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString());
      
      const monthlyUsage = usageData?.reduce((sum, item) => sum + item.amount, 0) || 0;
      
      // Get average rating from reviews
      const { data: ratings } = await supabase
        .from('reviews')
        .select('rating')
        .eq('user_id', user.id);
      
      const averageRating = ratings?.length > 0
        ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
        : 0;
      
      return {
        creditBalance: profile?.credit_balance || 0,
        creditLimit: profile?.credit_limit || 1000,
        activeAgents: activeAgents || 0,
        monthlyUsage,
        averageRating
      };
    },
    staleTime: 60000, // 1 minute
    retry: user ? 3 : 0,
  });

  return (
    <DashboardLayout type="user">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your account.
            </p>
          </div>
          <Button 
            className="sm:self-start"
            onClick={() => navigate('/dashboard/credits')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Buy Credits
          </Button>
        </div>

        <DashboardStatsGrid 
          creditBalance={dashboardData?.creditBalance || 0}
          activeAgents={dashboardData?.activeAgents || 0}
          monthlyUsage={dashboardData?.monthlyUsage || 0}
          averageRating={dashboardData?.averageRating || 0}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 p-5">
            <CreditUsageChart />
          </Card>
          <div className="lg:col-span-3 space-y-6">
            <UserActivityFeed />
            <NotificationsCenter />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
