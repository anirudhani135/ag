
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/shared/tables/DataTable";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Star, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

const DeveloperReviews = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['developer-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Developer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Average Rating"
            value="4.8/5"
            icon={<Star className="w-6 h-6" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Reviews"
            value={reviews?.length || 0}
            icon={<MessageSquare className="w-6 h-6" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Positive Feedback"
            value="92%"
            icon={<ThumbsUp className="w-6 h-6" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Review Trend"
            value="+15%"
            icon={<TrendingUp className="w-6 h-6" />}
            isLoading={isLoading}
          />
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
          {/* Add DataTable component here */}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperReviews;
