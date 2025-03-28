
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal = ({ isOpen, onClose }: ReviewModalProps) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] mx-auto">
        <DialogHeader>
          <DialogTitle>Submit Review</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={selectedAgent}
            onValueChange={setSelectedAgent}
          >
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coming-soon">Coming Soon</SelectItem>
              <SelectItem value="placeholder-agent">Available Agent</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
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

          <Textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
