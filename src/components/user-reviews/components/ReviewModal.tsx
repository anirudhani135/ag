
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { handleSupabaseError } from '@/utils/errorHandling';
import { useFormValidation } from '@/hooks/useFormValidation';
import { HelpTooltip } from '@/components/shared/HelpTooltip';
import { ErrorHandler } from '@/components/shared/ErrorHandler';
import { logActivity } from '@/utils/activityLogger';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  existingReviewId?: string;
}

interface Agent {
  id: string;
  title: string;
}

interface ReviewFormData {
  agentId: string;
  rating: number;
  comment: string;
}

const ReviewModal = ({ isOpen, onClose, onSuccess, existingReviewId }: ReviewModalProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExistingReview, setIsLoadingExistingReview] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Form validation setup
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  } = useFormValidation<ReviewFormData>(
    {
      agentId: '',
      rating: 0,
      comment: ''
    },
    {
      agentId: {
        required: true,
        message: 'Please select an agent to review'
      },
      rating: {
        required: true,
        min: 1,
        message: 'Please select a rating'
      },
      comment: {
        required: true,
        minLength: 10,
        message: 'Please provide a comment of at least 10 characters'
      }
    }
  );

  // Fetch existing review if editing
  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!existingReviewId || !isOpen) return;
      
      setIsLoadingExistingReview(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', existingReviewId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setValues({
            agentId: data.agent_id,
            rating: data.rating,
            comment: data.comment || ''
          });
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        setError(error instanceof Error ? error : new Error('Failed to load review'));
      } finally {
        setIsLoadingExistingReview(false);
      }
    };
    
    fetchExistingReview();
  }, [existingReviewId, isOpen, setValues]);

  // Fetch available agents
  useEffect(() => {
    const fetchAgents = async () => {
      if (!isOpen) return;
      
      setIsLoadingAgents(true);
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('id, title')
          .eq('status', 'published')
          .order('title');
          
        if (error) {
          handleSupabaseError(error, { 
            operation: 'fetchAgents', 
            resource: 'agents' 
          });
          throw error;
        }
        
        setAgents(data || []);
        
        // If no agents found and in development, add some mock data
        if ((!data || data.length === 0) && process.env.NODE_ENV === 'development') {
          console.log('No agents found, using mock data');
          setAgents([
            { id: 'agent-1', title: 'Customer Support Agent' },
            { id: 'agent-2', title: 'Data Analysis Assistant' },
            { id: 'agent-3', title: 'Content Creation Bot' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        setError(error instanceof Error ? error : new Error('Failed to load agents'));
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, [isOpen]);

  const onSubmitReview = async (formData: ReviewFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error('You must be logged in to submit a review');
      }

      const reviewData = {
        user_id: userData.user.id,
        agent_id: formData.agentId,
        rating: formData.rating,
        comment: formData.comment,
      };

      let error;
      
      // Update or insert review
      if (existingReviewId) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', existingReviewId);
        error = updateError;
        
        // Log activity
        await logActivity('review_edit', { 
          reviewId: existingReviewId,
          agentId: formData.agentId
        });
      } else {
        const { error: insertError } = await supabase
          .from('reviews')
          .insert(reviewData);
        error = insertError;
        
        // Log activity
        await logActivity('review_create', { 
          agentId: formData.agentId, 
          rating: formData.rating 
        });
      }

      if (error) {
        handleSupabaseError(error, { 
          operation: existingReviewId ? 'updateReview' : 'createReview', 
          resource: 'reviews' 
        });
        throw error;
      }

      toast({
        title: "Success",
        description: existingReviewId 
          ? "Your review has been updated" 
          : "Your review has been submitted",
      });
      
      if (onSuccess) onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetError = () => {
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
        setError(null);
      }
    }}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] mx-auto">
        <DialogHeader>
          <DialogTitle>
            {existingReviewId ? 'Edit Review' : 'Submit Review'}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <ErrorHandler 
            error={error} 
            resetError={handleResetError} 
            retry={() => error && handleSubmit(onSubmitReview)}
          />
        )}
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="agent-select" className="text-sm font-medium flex items-center">
              Select Agent
              <span className="text-red-500 ml-1">*</span>
              <HelpTooltip 
                content="Choose the agent you want to review. You can only review agents you've interacted with."
              />
            </label>
            <Select
              value={values.agentId}
              onValueChange={(value) => handleChange('agentId', value)}
              disabled={isLoadingAgents || isSubmitting || isLoadingExistingReview}
              onOpenChange={() => handleBlur('agentId')}
            >
              <SelectTrigger id="agent-select" className="min-h-[44px]">
                <SelectValue placeholder={isLoadingAgents ? "Loading agents..." : "Select an agent"} />
              </SelectTrigger>
              <SelectContent>
                {agents.length === 0 ? (
                  <SelectItem value="no-agents" disabled>No agents available</SelectItem>
                ) : (
                  agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {touched.agentId && errors.agentId && (
              <p className="text-sm text-red-500 mt-1">{errors.agentId}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              Rating
              <span className="text-red-500 ml-1">*</span>
              <HelpTooltip 
                content="Rate your experience with this agent from 1 to 5 stars."
              />
            </label>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange('rating', value)}
                  onFocus={() => handleBlur('rating')}
                  className="focus:outline-none p-1 min-h-[44px] min-w-[44px] transition-transform hover:scale-110"
                  aria-label={`Rate ${value} stars`}
                  disabled={isSubmitting || isLoadingExistingReview}
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= values.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {touched.rating && errors.rating && (
              <p className="text-sm text-red-500 mt-1">{errors.rating}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-sm font-medium flex items-center">
              Your Review
              <span className="text-red-500 ml-1">*</span>
              <HelpTooltip 
                content="Share your experience with this agent. What worked well? What could be improved?"
              />
            </label>
            <Textarea
              id="review-comment"
              placeholder="Write your review..."
              value={values.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              onBlur={() => handleBlur('comment')}
              rows={4}
              className="min-h-[100px] resize-none"
              disabled={isSubmitting || isLoadingExistingReview}
            />
            {touched.comment && errors.comment && (
              <p className="text-sm text-red-500 mt-1">{errors.comment}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              onClose();
              resetForm();
            }} 
            className="w-full sm:w-auto"
            disabled={isSubmitting || isLoadingExistingReview}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmit(onSubmitReview)}
            disabled={isSubmitting || isLoadingExistingReview}
            className="w-full sm:w-auto"
          >
            {isSubmitting 
              ? 'Submitting...' 
              : existingReviewId 
                ? 'Update Review' 
                : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
