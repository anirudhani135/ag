
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  agentName: string;
}

interface UserActivityFeedProps {
  activities?: UserActivity[];
}

export const UserActivityFeed = ({ activities = [] }: UserActivityFeedProps) => {
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
          {activities?.length ? (
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
                  <time className="text-sm text-muted-foreground">
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
