
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { type UserActivityFeedProps } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export const UserActivityFeed = ({ 
  activities = [], 
  isLoading, 
  error 
}: UserActivityFeedProps) => {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading activities</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground">Loading activities...</p>
          ) : activities?.length ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    Agent: {activity.agentName}
                  </p>
                  <time 
                    className={cn(
                      "text-sm text-muted-foreground",
                      activity.status === 'error' && "text-destructive",
                      activity.status === 'warning' && "text-warning",
                      activity.status === 'success' && "text-success"
                    )}
                  >
                    {new Date(activity.timestamp).toLocaleString()}
                  </time>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
