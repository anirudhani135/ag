
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface ActivityItem {
  id: string;
  agent: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: "reviewed" | "purchased" | "deployed" | "updated";
  rating?: number;
  timestamp: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from a real activity stream
        // For now, we'll use mock data
        const mockActivities: ActivityItem[] = [
          {
            id: "1",
            agent: { id: "agent-1", title: "Customer Support Agent" },
            user: { id: "user-1", name: "Alex Johnson" },
            action: "reviewed",
            rating: 5,
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          },
          {
            id: "2",
            agent: { id: "agent-2", title: "Data Analysis Bot" },
            user: { id: "user-2", name: "Sarah Parker" },
            action: "purchased",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
          {
            id: "3",
            agent: { id: "agent-3", title: "Social Media Assistant" },
            user: { id: "user-3", name: "Miguel Rodriguez" },
            action: "deployed",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          },
          {
            id: "4",
            agent: { id: "agent-4", title: "Content Creation Bot" },
            user: { id: "user-4", name: "Emily Chen" },
            action: "updated",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          },
          {
            id: "5",
            agent: { id: "agent-5", title: "Chatbot Framework" },
            user: { id: "user-5", name: "Devon Wilson" },
            action: "reviewed",
            rating: 4,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getActionBadge = (action: ActivityItem["action"]) => {
    switch (action) {
      case "reviewed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Reviewed</Badge>;
      case "purchased":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Purchased</Badge>;
      case "deployed":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Deployed</Badge>;
      case "updated":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Updated</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No recent activity to show</p>
          </CardContent>
        </Card>
      ) : (
        activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-sm">
                      <span>{activity.user.name}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>{" "}
                      <span className="font-semibold">{activity.agent.title}</span>
                    </p>
                    {getActionBadge(activity.action)}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                    {activity.rating && (
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < activity.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default RecentActivity;
