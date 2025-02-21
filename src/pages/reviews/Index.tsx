
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Reviews = () => {
  const { agentId } = useParams();
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Reviews & Feedback</h2>
          <p className="text-muted-foreground">Share your experience and read others' reviews</p>
        </div>

        {agentId && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <ReviewForm
              agentId={agentId}
              onSuccess={() => {
                setIsSubmittingReview(false);
              }}
            />
          </Card>
        )}

        <ReviewList agentId={agentId} />
      </div>
    </DashboardLayout>
  );
};

export default Reviews;
