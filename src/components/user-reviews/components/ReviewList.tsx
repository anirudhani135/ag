import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Star, Filter, User, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  developer_reply?: string;
  developer_reply_at?: string;
  agent: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface ReviewListProps {
  showFilter?: boolean;
  onOpenReviewModal?: () => void;
  agentId?: string;
}

export function ReviewList({ showFilter = false, onOpenReviewModal, agentId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number[]>([1, 2, 3, 4, 5]);
  const { toast } = useToast();

  // Fetch reviews from the database when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            developer_reply,
            developer_reply_at,
            agent:agent_id (id, title),
            user:user_id (id, name, avatar_url)
          `)
          .order('created_at', { ascending: false });
          
        // If agentId is provided, only fetch reviews for that agent
        if (agentId) {
          query = query.eq('agent_id', agentId);
        }
        
        // Otherwise, fetch current user's reviews
        else {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            query = query.eq('user_id', userData.user.id);
          }
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // If no reviews found, fallback to mock data
        if (!data || data.length === 0) {
          console.log('No reviews found, using mock data');
          // Mock data for development
          const mockReviews = [
            {
              id: '1',
              rating: 5,
              comment: 'This agent has revolutionized how our team handles customer inquiries. The natural language understanding is impressive.',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
              agent: { id: 'agent-1', title: 'Customer Support Agent' },
              user: { id: 'user-1', name: 'Jane Smith' }
            },
            {
              id: '2',
              rating: 4,
              comment: 'Very helpful for analyzing large datasets. Could use some improvements with complex queries, but overall quite satisfied.',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
              developer_reply: 'Thank you for your feedback! We are working on improving complex query handling in the next update.',
              developer_reply_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(), // 13 days ago
              agent: { id: 'agent-2', title: 'Data Analysis Assistant' },
              user: { id: 'user-1', name: 'Jane Smith' }
            },
            {
              id: '3',
              rating: 3,
              comment: 'Decent content generation, but needs work on maintaining consistent tone throughout longer pieces.',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
              agent: { id: 'agent-3', title: 'Content Creation Bot' },
              user: { id: 'user-1', name: 'Jane Smith' }
            }
          ];
          setReviews(mockReviews);
        } else {
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: "Error",
          description: "Failed to load reviews. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [agentId, toast]);

  // Apply filters and sorting to reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(review => {
        // Filter by star rating
        if (!ratingFilter.includes(review.rating)) return false;
        
        // Filter by review type (with or without developer replies)
        if (filter === "with-replies" && !review.developer_reply) return false;
        if (filter === "without-replies" && review.developer_reply) return false;
        
        // Search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            review.comment.toLowerCase().includes(query) ||
            review.agent.title.toLowerCase().includes(query) ||
            (review.developer_reply && review.developer_reply.toLowerCase().includes(query))
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === "recent") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else if (sortBy === "highest") {
          return b.rating - a.rating;
        } else if (sortBy === "lowest") {
          return a.rating - b.rating;
        }
        return 0;
      });
  }, [reviews, filter, sortBy, searchQuery, ratingFilter]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Render empty state
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 mb-6">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No reviews yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {agentId 
                ? "Be the first to leave a review for this agent."
                : "You haven't written any reviews yet. Start by exploring agents in the marketplace."}
            </p>
          </div>
          
          {onOpenReviewModal && (
            <Button onClick={onOpenReviewModal}>
              Write a Review
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render reviews with filters
  return (
    <div className="space-y-6">
      {showFilter && (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
          <div className="flex-1 max-w-md">
            <Input 
              placeholder="Search reviews..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter Ratings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <DropdownMenuCheckboxItem
                    key={rating}
                    checked={ratingFilter.includes(rating)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setRatingFilter([...ratingFilter, rating]);
                      } else {
                        setRatingFilter(ratingFilter.filter(r => r !== rating));
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="with-replies">With Replies</SelectItem>
                <SelectItem value="without-replies">Without Replies</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No reviews match your filters</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setFilter("all");
                  setSortBy("recent");
                  setSearchQuery("");
                  setRatingFilter([1, 2, 3, 4, 5]);
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user.avatar_url} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                      <div>
                        <div className="font-medium">{review.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(review.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Star
                              key={value}
                              className={`h-4 w-4 ${
                                value <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {review.agent.title}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      {review.comment}
                    </div>
                    
                    {review.developer_reply && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">Developer Response</div>
                          {review.developer_reply_at && (
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(review.developer_reply_at), "MMM d, yyyy")}
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-sm">{review.developer_reply}</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewList;
