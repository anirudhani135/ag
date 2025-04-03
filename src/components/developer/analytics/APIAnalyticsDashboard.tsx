
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { BaseChart } from "@/components/shared/charts/BaseChart";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Activity, AlertCircle, Globe, Server } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const APIAnalyticsDashboard = () => {
  const { data: apiMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['api-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000, // Cache for 30 seconds to reduce API calls
  });

  const { data: performanceMetrics, isLoading: performanceLoading } = useQuery({
    queryKey: ['system-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  const chartData = apiMetrics?.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    responseTime: metric.response_time,
    requests: 1
  })) || [];

  // Animate cards with staggered delay
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <MetricCard
            title="API Response Time"
            value={`${performanceMetrics?.response_time || 0}ms`}
            icon={<Server className="w-6 h-6 text-blue-500" />}
            isLoading={performanceLoading}
            className="border-blue-100 bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all duration-300"
          />
        </motion.div>
        
        <motion.div 
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <MetricCard
            title="Error Rate"
            value={`${(performanceMetrics?.error_rate || 0).toFixed(2)}%`}
            icon={<AlertCircle className="w-6 h-6 text-amber-500" />}
            isLoading={performanceLoading}
            className="border-amber-100 bg-gradient-to-br from-white to-amber-50 hover:shadow-lg transition-all duration-300"
          />
        </motion.div>
        
        <motion.div 
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <MetricCard
            title="Uptime"
            value={`${(performanceMetrics?.uptime_percentage || 0).toFixed(1)}%`}
            icon={<Activity className="w-6 h-6 text-green-500" />}
            isLoading={performanceLoading}
            className="border-green-100 bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all duration-300"
          />
        </motion.div>
        
        <motion.div 
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <MetricCard
            title="Active Regions"
            value="Global"
            icon={<Globe className="w-6 h-6 text-purple-500" />}
            isLoading={performanceLoading}
            className="border-purple-100 bg-gradient-to-br from-white to-purple-50 hover:shadow-lg transition-all duration-300"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="overflow-hidden border-blue-100 hover:shadow-lg transition-all duration-300">
            <BaseChart
              title="API Response Times"
              subtitle="Last 100 requests"
              isLoading={metricsLoading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="responseTime" 
                    name="Response Time (ms)"
                    stroke="#8884d8" 
                    fill="url(#responseTimeGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </BaseChart>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="overflow-hidden border-green-100 hover:shadow-lg transition-all duration-300">
            <BaseChart
              title="Request Volume"
              subtitle="Requests per minute"
              isLoading={metricsLoading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    name="Requests"
                    stroke="#82ca9d" 
                    fill="url(#requestsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </BaseChart>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
