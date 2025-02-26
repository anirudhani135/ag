
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from './LoadingSpinner';

interface ReviewListProps {
  sortBy: string;
}

const ReviewList = ({ sortBy }: ReviewListProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['user-reviews', sortBy],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      let query = supabase
        .from('reviews')
        .select('*, agents(title)')
        .eq('user_id', user.data.user?.id);

      if (sortBy === 'date') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  if (!reviews?.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>No reviews yet</p>
          <p className="text-sm mt-2">Share your experience with AI agents</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Your Reviews</h3>
      <ScrollArea className="h-[400px]">
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{review.agents?.title}</h4>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{review.rating}/5</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {review.comment}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Posted {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ReviewList;
