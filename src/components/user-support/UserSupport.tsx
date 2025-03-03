
import React, { lazy, Suspense } from 'react';
import { LifeBuoy, Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SupportMetrics } from './components/SupportMetrics';
import { LoadingSpinner } from './components/LoadingSpinner';
import { cn } from '@/lib/utils';

// Lazy loaded components
const NewTicketModal = lazy(() => import('./components/NewTicketModal'));
const SupportList = lazy(() => import('./components/SupportList'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const RecentActivity = lazy(() => import('./components/RecentActivity'));

export const UserSupport = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { toast } = useToast();

  const handleNewTicket = () => {
    // Feature is pending
    toast({
      title: "Coming Soon",
      description: "Ticket submission will be available soon.",
      variant: "default"
    });
    // setIsModalOpen(true); // Enable when feature is ready
  };

  return (
    <DashboardLayout type="user">
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Support</h2>
            <p className="text-muted-foreground">
              Get help with your AI agents and marketplace queries
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search support..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleNewTicket}
              className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <SupportMetrics />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={<LoadingSpinner />}>
            <SupportList searchQuery={searchQuery} />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <FAQSection searchQuery={searchQuery} />
          </Suspense>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <RecentActivity />
        </Suspense>

        {/* Future Features Section */}
        <Card className="p-6 text-center text-muted-foreground">
          <LifeBuoy className="mx-auto h-12 w-12 opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">Coming Soon</h3>
          <p className="mt-2">Live chat support and AI-powered assistance</p>
        </Card>

        <Suspense fallback={<LoadingSpinner />}>
          {isModalOpen && (
            <NewTicketModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Suspense>
      </div>
    </DashboardLayout>
  );
};

export default UserSupport;
