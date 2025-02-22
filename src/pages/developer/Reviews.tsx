
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/shared/tables/DataTable";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Star, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

interface Review {
  id: string;
  agent_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  developer_reply: string | null;
  developer_reply_at: string | null;
}

const DeveloperReviews = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['developer-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Review[];
    }
  });

  const calculateAverageRating = (reviews: Review[] | null) => {
    if (!reviews || reviews.length === 0) return "0.0";
    const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    return average.toFixed(1);
  };

  const calculatePositiveFeedback = (reviews: Review[] | null) => {
    if (!reviews || reviews.length === 0) return "0%";
    const positiveReviews = reviews.filter(review => review.rating >= 4).length;
    return `${Math.round((positiveReviews / reviews.length) * 100)}%`;
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Developer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Average Rating"
            value={`${calculateAverageRating(reviews)}/5`}
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
            value={calculatePositiveFeedback(reviews)}
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
          {reviews && <DataTable 
            columns={[
              {
                accessorKey: 'rating',
                header: 'Rating',
                cell: ({ row }) => `${row.getValue('rating')}/5`
              },
              {
                accessorKey: 'comment',
                header: 'Comment'
              },
              {
                accessorKey: 'created_at',
                header: 'Date',
                cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString()
              }
            ]} 
            data={reviews}
          />}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperReviews;
