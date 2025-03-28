
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { subscribeToHealthUpdates, subscribeToRevenue } from '@/lib/realtimeSubscriptions';
import { logActivity } from '@/utils/activityLogger';

interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export const RealTimeMetrics = () => {
  const [revenueData, setRevenueData] = useState<MetricDataPoint[]>([]);
  const [healthData, setHealthData] = useState<MetricDataPoint[]>([]);

  // Fetch initial metrics data
  const { data: initialMetrics, isLoading } = useQuery({
    queryKey: ['system-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Log this activity
      await logActivity('agent_view', { component: 'RealTimeMetrics', action: 'fetch_metrics' });
      
      return data;
    },
  });

  // Set up real-time subscriptions
  useEffect(() => {
    if (initialMetrics) {
      // Format initial data
      const formatted = initialMetrics.map(metric => ({
        timestamp: new Date(metric.timestamp).toLocaleTimeString(),
        value: metric.response_time
      }));
      setHealthData(formatted);
    }

    // Subscribe to real-time updates
    const healthChannel = subscribeToHealthUpdates((payload) => {
      if (payload.new) {
        const newData = {
          timestamp: new Date(payload.new.timestamp).toLocaleTimeString(),
          value: payload.new.response_time
        };
        
        setHealthData(prev => {
          const updated = [...prev, newData].slice(-20); // Keep last 20 data points
          return updated;
        });
      }
    });

    const revenueChannel = subscribeToRevenue((payload) => {
      if (payload.new && payload.new.total_revenue) {
        const newData = {
          timestamp: new Date(payload.new.created_at).toLocaleTimeString(),
          value: payload.new.total_revenue
        };
        
        setRevenueData(prev => {
          const updated = [...prev, newData].slice(-20); // Keep last 20 data points
          return updated;
        });
      }
    });

    // Clean up subscriptions
    return () => {
      healthChannel.unsubscribe();
      revenueChannel.unsubscribe();
    };
  }, [initialMetrics]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading metrics data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time System Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Response Time (ms)" 
                stroke="#8884d8" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
