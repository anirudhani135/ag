
import React, { lazy, Suspense } from 'react';
import { Star, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy loaded components
const ReviewList = lazy(() => import('./components/ReviewList'));
const RecentActivity = lazy(() => import('./components/RecentActivity'));
const ReviewModal = lazy(() => import('./components/ReviewModal'));

export const UserReviews = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('date');
  const { toast } = useToast();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['review-metrics'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('user_id', user.data.user?.id);

      if (error) throw error;

      const avgRating = data.reduce((acc, curr) => acc + curr.rating, 0) / data.length;
      return {
        averageRating: avgRating || 0,
        totalReviews: data.length
      };
    }
  });

  const handleNewReview = () => {
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout type="user">
      <div className="min-h-screen space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            <p className="text-muted-foreground">
              Manage your agent reviews and feedback
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleNewReview}
              variant="action"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Review
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {metricsLoading ? '[Loading...]' : `${metrics?.averageRating.toFixed(1)}/5.0`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              From {metricsLoading ? '[Loading...]' : metrics?.totalReviews} reviews
            </p>
          </Card>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <ReviewList sortBy={sortBy} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <RecentActivity />
        </Suspense>

        <Card className="p-6 text-center text-muted-foreground bg-white shadow-md">
          <Star className="mx-auto h-12 w-12 opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">Coming Soon</h3>
          <p className="mt-2">AI-powered review insights and sentiment analysis</p>
        </Card>

        {isModalOpen && (
          <Suspense fallback={<LoadingSpinner />}>
            <ReviewModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </Suspense>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserReviews;
