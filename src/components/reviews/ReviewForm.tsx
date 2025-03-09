
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface ReviewFormProps {
  agentId: string;
  reviewText: string;
  setReviewText: (text: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  onReviewSubmitted: () => Promise<void>;
}

export const ReviewForm = ({
  agentId,
  reviewText,
  setReviewText,
  rating,
  setRating,
  onReviewSubmitted
}: ReviewFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Write a Review</h3>
      
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {rating > 0 ? `${rating}/5 stars` : 'Select rating'}
        </span>
      </div>
      
      <Textarea
        placeholder="Share your experience with this agent..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
      />
      
      <Button 
        onClick={onReviewSubmitted}
        disabled={!reviewText || rating === 0}
      >
        Submit Review
      </Button>
    </div>
  );
};
