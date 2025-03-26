
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import { 
  Activity,
  ShoppingCart,
  Code,
  Settings,
  User,
  Download,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  agentName?: string;
  metadata?: Record<string, any>;
  status?: string;
}

interface UserActivityFeedProps {
  activities?: UserActivity[];
  isLoading?: boolean;
  limit?: number;
}

export const UserActivityFeed = ({ 
  activities: propActivities, 
  isLoading: propLoading,
  limit = 5
}: UserActivityFeedProps) => {
  const { user } = useAuth();
  
  // Fetch activities if not provided as props
  const { data: fetchedActivities, isLoading: queryLoading } = useQuery({
    queryKey: ['user-activities', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data.map((activity): UserActivity => {
        const metadata = activity.metadata as Record<string, any> || {};
        
        return {
          id: activity.id,
          action: activity.activity_type,
          timestamp: activity.created_at,
          agentName: metadata.agent_name || '',
          metadata: metadata,
          status: metadata.status || 'completed'
        };
      });
    },
    enabled: !propActivities && !!user, // Only run if activities not provided via props
    staleTime: 60 * 1000 // 1 minute
  });
  
  // Use provided activities or fetched ones
  const activities = propActivities || fetchedActivities || [];
  const isLoading = propLoading || queryLoading;
  
  // Activity icon mapping
  const getActivityIcon = (action: string) => {
    const actionMap: Record<string, React.ReactNode> = {
      'purchase': <ShoppingCart className="h-3 w-3" />,
      'deploy': <Code className="h-3 w-3" />,
      'update': <Settings className="h-3 w-3" />,
      'login': <User className="h-3 w-3" />,
      'download': <Download className="h-3 w-3" />,
      'testing': <Activity className="h-3 w-3" />,
    };
    
    return actionMap[action.toLowerCase()] || <ExternalLink className="h-3 w-3" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(limit)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
              {getActivityIcon(activity.action)}
            </div>
            <div>
              <p className="text-sm font-medium">
                {activity.action}
                {activity.agentName && ` - ${activity.agentName}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {activity.status && (
            <StatusBadge status={activity.status} />
          )}
        </div>
      ))}
      
      {activities.length > 0 && (
        <div className="flex justify-center pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {/* Navigate to full activity page */}}
          >
            View all activity
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
