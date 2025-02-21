
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type SortOption = 'date' | 'rating' | 'helpful';

interface ReviewListProps {
  agentId?: string;
}

interface Review {
  id: string;
  agent_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_votes: number;
  unhelpful_votes: number;
  screenshot_url: string | null;
  profiles: {
    name: string;
    avatar_url: string | null;
  };
}

export const ReviewList = ({ agentId }: ReviewListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', agentId, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (name, avatar_url)
        `);

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      switch (sortBy) {
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'helpful':
          query = query.order('helpful_votes', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    },
  });

  const filteredReviews = reviews?.filter(review =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            onClick={() => setSortBy('date')}
            size="sm"
          >
            Latest
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            onClick={() => setSortBy('rating')}
            size="sm"
          >
            Highest Rated
          </Button>
          <Button
            variant={sortBy === 'helpful' ? 'default' : 'outline'}
            onClick={() => setSortBy('helpful')}
            size="sm"
          >
            Most Helpful
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : filteredReviews?.length ? (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {review.profiles?.avatar_url ? (
                        <img
                          src={review.profiles.avatar_url}
                          alt={review.profiles.name}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-lg font-semibold">
                          {review.profiles?.name?.[0] || '?'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.profiles?.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-4">{review.comment}</p>
                    {review.screenshot_url && (
                      <img
                        src={`${supabase.storage.from('reviews').getPublicUrl(review.screenshot_url).data.publicUrl}`}
                        alt="Review screenshot"
                        className="mt-4 rounded-lg max-w-sm"
                      />
                    )}
                    <div className="flex items-center gap-4 mt-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {review.helpful_votes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {review.unhelpful_votes}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No reviews found</p>
          </Card>
        )}
      </div>
    </div>
  );
};
