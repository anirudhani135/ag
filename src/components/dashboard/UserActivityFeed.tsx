
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import { useAuth } from '@/context/AuthContext';
import { UserActivity } from "@/types/dashboard";
import { Bot, MessageSquare, CreditCard, Clock } from "lucide-react";

export const UserActivityFeed = ({ activities, isLoading }: { 
  activities?: UserActivity[];
  isLoading?: boolean;
}) => {
  const { user } = useAuth();
  
  const { data = [], isLoading: isLoadingData } = useQuery({
    queryKey: ['user-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];
      if (activities) return activities;
      
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      return (data || []).map(activity => {
        // Safely handle metadata - ensure it's an object before accessing properties
        const metadata = typeof activity.metadata === 'object' && activity.metadata !== null
          ? activity.metadata
          : {};
          
        // Type assertion for metadata to help TypeScript understand the structure
        const typedMetadata = metadata as Record<string, any>;
        
        return {
          id: activity.id,
          action: activity.activity_type,
          timestamp: activity.created_at,
          agentName: typedMetadata.agent_name || 'Unknown Agent',
          status: typedMetadata.status || 'success'
        } as UserActivity;
      });
    },
    enabled: !activities && !!user,
    staleTime: 30000,
  });

  const loading = isLoading || isLoadingData;

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'agent_interaction':
        return <Bot className="h-4 w-4 text-blue-500" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'purchase':
        return <CreditCard className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden border border-border">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-white pb-3">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-6 px-4">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((activity) => (
              <li key={activity.id} className="p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.action === 'agent_interaction'
                        ? `Interacted with ${activity.agentName}`
                        : activity.action === 'chat'
                        ? `New chat session`
                        : activity.action === 'purchase'
                        ? `Credits purchased`
                        : activity.action}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp 
                          ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) 
                          : 'Just now'}
                      </p>
                      <StatusBadge status={activity.status} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
