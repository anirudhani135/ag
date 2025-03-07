
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Activity, Clock, TrendingUp, CreditCard } from "lucide-react";

export const UserMetricsPanel = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['user-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('user_engagement_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);
        
      if (error) throw error;
      return data;
    }
  });

  const { data: creditHistory } = useQuery({
    queryKey: ['credit-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(30);
        
      if (error) throw error;
      
      // Transform data for chart
      return data.map(t => ({
        date: new Date(t.created_at).toLocaleDateString(),
        amount: t.amount,
        type: t.transaction_type
      }));
    }
  });

  const processActivityData = (data: any[]) => {
    if (!data || data.length === 0) return [];
    
    return data.map(record => ({
      date: new Date(record.created_at).toLocaleDateString(),
      duration: record.session_duration / 60, // Convert to minutes
      features: record.features_used ? Object.keys(record.features_used).length : 0,
      pages: record.pages_visited ? Object.keys(record.pages_visited).length : 0
    }));
  };

  const activityData = processActivityData(metrics || []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <MetricCard
                title="Session Duration"
                value={metrics && metrics.length > 0 ? `${Math.round((metrics[0].session_duration || 0) / 60)} min` : '0 min'}
                icon={<Clock className="h-4 w-4" />}
                isLoading={isLoading}
              />
              <MetricCard
                title="Features Used"
                value={metrics && metrics.length > 0 && metrics[0].features_used 
                  ? Object.keys(metrics[0].features_used).length.toString() 
                  : '0'}
                icon={<Activity className="h-4 w-4" />}
                isLoading={isLoading}
              />
              <MetricCard
                title="Pages Visited"
                value={metrics && metrics.length > 0 && metrics[0].pages_visited
                  ? Object.keys(metrics[0].pages_visited).length.toString()
                  : '0'}
                icon={<TrendingUp className="h-4 w-4" />}
                isLoading={isLoading}
              />
              <MetricCard
                title="Usage Trend"
                value={metrics && metrics.length > 1 
                  ? metrics[0].session_duration > metrics[1].session_duration 
                    ? 'Increasing' 
                    : 'Decreasing'
                  : 'Stable'}
                icon={<Activity className="h-4 w-4" />}
                isLoading={isLoading}
              />
            </div>
            
            <div className="h-80">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      name="Session Duration (min)"
                      stroke="#8884d8" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="features" 
                      name="Features Used"
                      stroke="#82ca9d" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="credits" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <MetricCard
                title="Credit Balance"
                value={metrics && metrics.length > 0 ? '2,450' : '0'}
                icon={<CreditCard className="h-4 w-4" />}
                isLoading={isLoading}
              />
              <MetricCard
                title="Last Purchase"
                value={creditHistory && creditHistory.length > 0 ? creditHistory[creditHistory.length - 1].date : 'N/A'}
                icon={<TrendingUp className="h-4 w-4" />}
                isLoading={isLoading}
              />
              <MetricCard
                title="Credits Used This Month"
                value="350"
                icon={<Activity className="h-4 w-4" />}
                isLoading={isLoading}
              />
            </div>
            
            <div className="h-80">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={creditHistory || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      name="Credits"
                      stroke="#8884d8" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
