
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SupportMetrics } from "@/components/user-support/components/SupportMetrics";
import SupportList from "@/components/user-support/components/SupportList";
import FAQSection from "@/components/user-support/components/FAQSection";
import NewTicketModal from "@/components/user-support/components/NewTicketModal";
import RecentActivity from "@/components/user-support/components/RecentActivity";
import { LoadingSpinner } from "@/components/user-support/components/LoadingSpinner";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const UserSupport = () => {
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Support Dashboard</h2>
            <p className="text-muted-foreground">
              Get help with your account and services
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="pl-9 w-full md:w-[250px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button 
              onClick={() => setIsNewTicketModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        </div>

        <SupportMetrics />

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Tickets</TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Knowledge Base</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets" className="space-y-4">
            <SupportList searchQuery={searchQuery} />
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-4">
            <FAQSection searchQuery={searchQuery} />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <RecentActivity />
          </TabsContent>
        </Tabs>

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
