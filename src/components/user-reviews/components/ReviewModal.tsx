
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Agent {
  id: string;
  title: string;
}

const ReviewModal = ({ isOpen, onClose, onSuccess }: ReviewModalProps) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('id, title')
          .eq('status', 'published')
          .order('title');
          
        if (error) throw error;
        setAgents(data || []);
      } catch (error) {
        console.error('Error fetching agents:', error);
        // Add some placeholder agents for dev purposes
        setAgents([
          { id: 'agent-1', title: 'Customer Support Agent' },
          { id: 'agent-2', title: 'Data Analysis Assistant' },
          { id: 'agent-3', title: 'Content Creation Bot' }
        ]);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedAgent('');
    setRating(0);
    setComment('');
  };

  const handleSubmit = async () => {
    if (!selectedAgent || !rating || !comment) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase.from('reviews').insert({
        user_id: user.data.user?.id,
        agent_id: selectedAgent,
        rating,
        comment,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your review has been submitted",
      });
      resetForm();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] mx-auto">
        <DialogHeader>
          <DialogTitle>Submit Review</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="agent-select" className="text-sm font-medium">
              Select Agent
            </label>
            <Select
              value={selectedAgent}
              onValueChange={setSelectedAgent}
              disabled={isLoadingAgents}
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none p-1 min-h-[44px] min-w-[44px]"
                  aria-label={`Rate ${value} stars`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="review-comment"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="min-h-[100px] resize-none"
            />
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
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
