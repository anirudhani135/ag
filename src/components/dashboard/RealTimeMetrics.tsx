
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { subscribeToHealthUpdates, subscribeToRevenue } from '@/lib/realtimeSubscriptions';
import { logActivity } from '@/utils/activityLogger';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export const RealTimeMetrics = () => {
  const [revenueData, setRevenueData] = useState<MetricDataPoint[]>([]);
  const [healthData, setHealthData] = useState<MetricDataPoint[]>([]);
  const healthChannelRef = useRef<any>(null);
  const revenueChannelRef = useRef<any>(null);

  // Fetch initial metrics data with 30-second stale time to improve performance
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
    staleTime: 30000, // 30 seconds
  });

  // Memoized update handler to prevent recreating on each render
  const handleHealthUpdate = useCallback((payload: any) => {
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
  }, []);

  const handleRevenueUpdate = useCallback((payload: any) => {
    if (payload.new && payload.new.total_revenue) {
      const newData = {
        timestamp: new Date(payload.new.created_at).toLocaleTimeString(),
        value: payload.new.total_revenue
      };
      
      setRevenueData(prev => {
        const updated = [...prev, newData].slice(-20);
        return updated;
      });
    }
  }, []);

  // Set up real-time subscriptions with cleanup
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
    healthChannelRef.current = subscribeToHealthUpdates(handleHealthUpdate);
    revenueChannelRef.current = subscribeToRevenue(handleRevenueUpdate);

    // Clean up subscriptions
    return () => {
      if (healthChannelRef.current) {
        healthChannelRef.current.unsubscribe();
      }
      if (revenueChannelRef.current) {
        revenueChannelRef.current.unsubscribe();
      }
    };
  }, [initialMetrics, handleHealthUpdate, handleRevenueUpdate]);

  // Performance optimized custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-medium text-blue-600">
            {payload[0].value} ms
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-[250px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-blue-100 hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-white to-blue-50">
          <CardTitle className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Real-Time System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] will-change-transform">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  tickCount={5}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Response Time (ms)" 
                  stroke="url(#performanceGradient)" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: "#8B5CF6" }} 
                  dot={false}
                  animationDuration={500}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
