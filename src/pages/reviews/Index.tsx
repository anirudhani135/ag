import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    agent_id: '',
    rating: 5,
    comment: '',
    user_id: '',
  });
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*');

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (): Promise<void> => {
    try {
      // Basic validation
      if (!newReview.agent_id || !newReview.user_id) {
        toast({
          title: "Error",
          description: "Agent ID and User ID are required.",
          variant: "destructive",
        })
        return;
      }
  
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview]);
  
      if (error) {
        console.error('Error submitting review:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Review submitted successfully.",
        })
        fetchReviews(); // Refresh reviews
        setNewReview({
          agent_id: '',
          rating: 5,
          comment: '',
          user_id: '',
        }); // Reset form
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reviews</h1>

      {/* Review Form */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Submit a Review</CardTitle>
          <CardDescription>Share your experience.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="agent-id">Agent ID</Label>
            <Input
              id="agent-id"
              value={newReview.agent_id}
              onChange={(e) => setNewReview({ ...newReview, agent_id: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-id">User ID</Label>
            <Input
              id="user-id"
              value={newReview.user_id}
              onChange={(e) => setNewReview({ ...newReview, user_id: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rating">Rating</Label>
            <Slider
              id="rating"
              defaultValue={[newReview.rating]}
              max={5}
              step={1}
              onValueChange={(value) => setNewReview({ ...newReview, rating: value[0] })}
            />
            <p>Rating: {newReview.rating}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </CardFooter>
      </Card>

      {/* Reviews List */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of your reviews.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Agent ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.agent_id}</TableCell>
                  <TableCell>{review.user_id}</TableCell>
                  <TableCell>{review.rating}</TableCell>
                  <TableCell>{review.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Index;
