
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  showFilter?: boolean;
  limit?: number;
  onOpenReviewModal?: () => void;
}

interface Review {
  id: string;
  user_id: string;
  agent_id: string;
  rating: number;
  comment: string;
  created_at: string;
  developer_reply?: string;
  developer_reply_at?: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
  agent?: {
    title: string;
  };
}

export function ReviewList({ showFilter = true, limit = 10, onOpenReviewModal }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const [agents, setAgents] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('id, title')
          .eq('status', 'published');
          
        if (error) throw error;
        setAgents(data || []);
      } catch (error) {
        console.error('Error fetching agents:', error);
        // Provide some fallback data
        setAgents([
          { id: 'agent-1', title: 'Customer Support Agent' },
          { id: 'agent-2', title: 'Data Analysis Assistant' },
          { id: 'agent-3', title: 'Content Creation Bot' }
        ]);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Calculate pagination
        const from = (currentPage - 1) * limit;
        const to = from + limit - 1;
        
        // Build query
        let query = supabase
          .from('reviews')
          .select(`
            *,
            user:user_id (name, avatar_url),
            agent:agent_id (title)
          `)
          .range(from, to);
        
        // Apply filters
        if (agentFilter) {
          query = query.eq('agent_id', agentFilter);
        }
        
        // Apply sorting
        if (filter === 'recent') {
          query = query.order('created_at', { ascending: false });
        } else if (filter === 'highest') {
          query = query.order('rating', { ascending: false });
        } else if (filter === 'lowest') {
          query = query.order('rating', { ascending: true });
        }
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        // Get total count for pagination
        const { count: totalCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });
        
        if (totalCount) {
          setTotalPages(Math.ceil(totalCount / limit));
        }
        
        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Add some mock data for development
        setReviews([
          {
            id: '1',
            user_id: 'user-1',
            agent_id: 'agent-1',
            rating: 5,
            comment: 'This agent is extremely helpful and saved me hours of work!',
            created_at: new Date().toISOString(),
            user: { name: 'John Smith' },
            agent: { title: 'Customer Support Agent' }
          },
          {
            id: '2',
            user_id: 'user-2',
            agent_id: 'agent-2',
            rating: 4,
            comment: 'Very useful for analyzing data, but could be more intuitive.',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user: { name: 'Sarah Johnson' },
            agent: { title: 'Data Analysis Assistant' }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, filter, agentFilter, limit]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleAgentFilterChange = (value: string) => {
    setAgentFilter(value === 'all' ? null : value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate star rating UI
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <CardTitle>Reviews</CardTitle>
        
        {showFilter && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={agentFilter || 'all'} 
              onValueChange={handleAgentFilterChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No reviews yet</h3>
            <p className="text-muted-foreground mt-2">
              Be the first to share your experience!
            </p>
            {onOpenReviewModal && (
              <Button 
                onClick={onOpenReviewModal} 
                className="mt-4"
              >
                Write a Review
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-6 mt-2">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage 
                          src={review.user?.avatar_url} 
                          alt={review.user?.name || 'User'}
                        />
                        <AvatarFallback>
                          {(review.user?.name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {review.user?.name || 'Anonymous User'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex justify-end">
                        {renderStars(review.rating)}
                      </div>
                      {review.agent && (
                        <Badge variant="outline" className="mt-1">
                          {review.agent.title}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm">{review.comment}</p>
                  </div>
                  
                  {review.developer_reply && (
                    <div className="mt-4 ml-4 pt-3 pl-4 border-l">
                      <div className="text-xs font-medium flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Developer Response
                        {review.developer_reply_at && (
                          <span className="ml-1 text-muted-foreground">
                            • {formatDistanceToNow(new Date(review.developer_reply_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{review.developer_reply}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex items-center gap-1 text-muted-foreground"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Helpful
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === totalPages || 
                      Math.abs(page - currentPage) <= 1)
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            
            {onOpenReviewModal && (
              <div className="mt-6 flex justify-center">
                <Button onClick={onOpenReviewModal}>
                  Write a Review
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
