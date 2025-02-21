
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ReviewFormProps {
  agentId: string;
  onSuccess?: () => void;
}

interface ReviewFormData {
  rating: number;
  comment: string;
  screenshot?: FileList;
}

export const ReviewForm = ({ agentId, onSuccess }: ReviewFormProps) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ReviewFormData>();

  const onSubmit = async (data: ReviewFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      let screenshotUrl = null;
      if (data.screenshot?.[0]) {
        const file = data.screenshot[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${agentId}/${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('reviews')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        screenshotUrl = uploadData.path;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          agent_id: agentId,
          user_id: user.id,
          rating: selectedRating,
          comment: data.comment,
          screenshot_url: screenshotUrl
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });

      reset();
      setSelectedRating(0);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHoveredStar(rating)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setSelectedRating(rating)}
          >
            <Star
              className={`w-6 h-6 ${
                rating <= (hoveredStar || selectedRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Share your experience with this agent..."
        {...register('comment', { required: true })}
        className="min-h-[100px]"
      />

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          {...register('screenshot')}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        <Button type="submit" disabled={isSubmitting || !selectedRating}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};
