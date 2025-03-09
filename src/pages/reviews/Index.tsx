import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ReviewsPage = () => {
  const [agentId, setAgentId] = useState('sample-agent-id');
  const { toast } = useToast();
  
  const handleReviewSubmitted = () => {
    toast({
      title: "Review submitted",
      description: "Your review has been submitted successfully",
    });
  };
  
  return (
    <DashboardLayout type="user">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Submit a Review</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Agent Review</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm 
              agentId={agentId} 
              onReviewSubmitted={handleReviewSubmitted} 
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewsPage;
