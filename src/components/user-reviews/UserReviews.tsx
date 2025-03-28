
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ReviewList from "./components/ReviewList";
import ReviewModal from "./components/ReviewModal";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivity from "./components/RecentActivity";

export default function UserReviews() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-reviews");

  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleReviewSuccess = () => {
    // Refresh reviews or show success message
    setActiveTab("my-reviews");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            <p className="text-muted-foreground">
              View and manage your agent reviews
            </p>
          </div>
          <Button onClick={handleOpenReviewModal} className="w-full sm:w-auto">
            <PenSquare className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </div>

        <Tabs
          defaultValue="my-reviews"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-2 h-auto">
            <TabsTrigger value="my-reviews" className="py-2">
              My Reviews
            </TabsTrigger>
            <TabsTrigger value="activity" className="py-2">
              Recent Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-reviews" className="mt-6">
            <ReviewList 
              showFilter={true} 
              onOpenReviewModal={handleOpenReviewModal} 
            />
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <RecentActivity />
          </TabsContent>
        </Tabs>
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={handleCloseReviewModal} 
        onSuccess={handleReviewSuccess}
      />
    </DashboardLayout>
  );
}
