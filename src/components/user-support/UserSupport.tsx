
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SupportMetrics } from "@/components/user-support/components/SupportMetrics";
import SupportList from "@/components/user-support/components/SupportList";
import FAQSection from "@/components/user-support/components/FAQSection";
import NewTicketModal from "@/components/user-support/components/NewTicketModal";
import RecentActivity from "@/components/user-support/components/RecentActivity";
import { LoadingSpinner } from "@/components/user-support/components/LoadingSpinner";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const UserSupport = () => {
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      // Simulate API call
      return [
        { id: '1', subject: 'Payment issue', status: 'open', priority: 'high', created_at: '2023-08-20T10:30:00Z' },
        { id: '2', subject: 'Account access', status: 'closed', priority: 'medium', created_at: '2023-08-15T14:20:00Z' },
        { id: '3', subject: 'Feature request', status: 'open', priority: 'low', created_at: '2023-08-10T09:15:00Z' },
      ];
    },
    staleTime: 60000,
  });

  const handleNewTicket = (ticketData: any) => {
    toast({
      title: "Support ticket created",
      description: "Your support ticket has been submitted successfully. We'll get back to you soon.",
      variant: "default",
    });
    setIsNewTicketModalOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Support Dashboard</h2>
            <p className="text-muted-foreground">
              Get help with your account and services
            </p>
          </div>
          <Button 
            onClick={() => setIsNewTicketModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>

        <SupportMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SupportList searchQuery={searchQuery} />
            <RecentActivity />
          </div>
          <div>
            <FAQSection searchQuery={searchQuery} />
          </div>
        </div>

        <NewTicketModal 
          isOpen={isNewTicketModalOpen}
          onClose={() => setIsNewTicketModalOpen(false)}
          onSubmit={handleNewTicket}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserSupport;
