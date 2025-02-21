import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, Search, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SortOption = 'date' | 'rating' | 'helpful';

interface ReviewListProps {
  agentId?: string;
  isDeveloper?: boolean;
}

interface Review {
  id: string;
  agent_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  helpful_votes: number;
  unhelpful_votes: number;
  screenshot_url: string | null;
  developer_reply: string | null;
  developer_reply_at: string | null;
  profiles: {
    name: string;
    avatar_url: string | null;
  };
}

interface SentimentSummary {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export const ReviewList = ({ agentId, isDeveloper }: ReviewListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const { data: reviews, isLoading, refetch } = useQuery({
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
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sentimentSummary: SentimentSummary | undefined = reviews?.reduce(
    (acc, review) => ({
      positive: acc.positive + (review.rating >= 4 ? 1 : 0),
      neutral: acc.neutral + (review.rating === 3 ? 1 : 0),
      negative: acc.negative + (review.rating < 3 ? 1 : 0),
      total: acc.total + 1,
    }),
    { positive: 0, neutral: 0, negative: 0, total: 0 }
  );

  const handleReply = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          developer_reply: replyText[reviewId],
          developer_reply_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Reply posted",
        description: "Your response has been added to the review."
      });

      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {sentimentSummary && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sentiment Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {Math.round((sentimentSummary.positive / sentimentSummary.total) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Positive</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {Math.round((sentimentSummary.neutral / sentimentSummary.total) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Neutral</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {Math.round((sentimentSummary.negative / sentimentSummary.total) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Negative</p>
            </div>
          </div>
        </Card>
      )}

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
            <Card 
              key={review.id} 
              className={`p-6 ${
                review.rating < 3 ? 'border-red-200 bg-red-50/50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 w-full">
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
                  <div className="flex-1">
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

                    {review.developer_reply && (
                      <div className="mt-4 pl-4 border-l-2 border-primary">
                        <p className="text-sm font-semibold">Developer Response</p>
                        <p className="mt-1">{review.developer_reply}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(review.developer_reply_at!).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {isDeveloper && !review.developer_reply && (
                      <div className="mt-4">
                        <Textarea
                          placeholder="Write a response..."
                          value={replyText[review.id] || ''}
                          onChange={(e) => setReplyText(prev => ({
                            ...prev,
                            [review.id]: e.target.value
                          }))}
                          className="mb-2"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText[review.id]}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Post Reply
                        </Button>
                      </div>
                    )}
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
