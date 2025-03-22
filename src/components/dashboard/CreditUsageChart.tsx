
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays } from "date-fns";
import { useAuth } from '@/context/AuthContext';

export const CreditUsageChart = () => {
  const { user } = useAuth();
  
  const { data, isLoading } = useQuery({
    queryKey: ['credit-usage-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data, error } = await supabase
        .from('credit_usage')
        .select('amount, created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Group data by day
      const groupedByDay = (data || []).reduce((acc, curr) => {
        const day = format(new Date(curr.created_at), 'yyyy-MM-dd');
        if (!acc[day]) {
          acc[day] = { day, credits: 0 };
        }
        acc[day].credits += curr.amount;
        return acc;
      }, {} as Record<string, { day: string; credits: number }>);
      
      // Fill in missing days
      const result = [];
      const today = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = subDays(today, i);
        const day = format(date, 'yyyy-MM-dd');
        if (groupedByDay[day]) {
          result.push({
            date: format(date, 'MMM dd'),
            credits: groupedByDay[day].credits
          });
        } else {
          result.push({
            date: format(date, 'MMM dd'),
            credits: 0
          });
        }
      }
      
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <div className="h-[300px]">
      <h3 className="text-sm font-medium mb-4">Credit Usage Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickFormatter={(tick, index) => index % 5 === 0 ? tick : ''}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip
            contentStyle={{ 
              borderRadius: '6px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="credits" 
            stroke="#3b82f6" 
            fill="url(#colorCredits)" 
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
