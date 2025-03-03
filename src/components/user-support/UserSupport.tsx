
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const UserSupport = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const { toast } = useToast();

  const openTicketModal = () => {
    setIsTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setIsTicketModalOpen(false);
  };

  const handleSubmitTicket = () => {
    // Simulate submitting a ticket
    toast({
      title: "Ticket submitted",
      description: "Your support ticket has been submitted successfully.",
    });
    closeTicketModal();
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">Support Center</h2>
        <Button 
          onClick={openTicketModal} 
          className="bg-primary hover:bg-primary/90 text-white font-medium"
        >
          New Ticket
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Support cards */}
        <div className="bg-muted/30 p-6 rounded-lg shadow-sm hover:shadow transition-shadow">
          <h3 className="text-lg font-medium mb-2">Documentation</h3>
          <p className="text-muted-foreground mb-4">Browse our user guides and help documentation</p>
          <Button variant="outline" className="w-full">View Documentation</Button>
        </div>
        
        <div className="bg-muted/30 p-6 rounded-lg shadow-sm hover:shadow transition-shadow">
          <h3 className="text-lg font-medium mb-2">Frequently Asked Questions</h3>
          <p className="text-muted-foreground mb-4">Find answers to common questions</p>
          <Button variant="outline" className="w-full">View FAQs</Button>
        </div>
        
        <div className="bg-muted/30 p-6 rounded-lg shadow-sm hover:shadow transition-shadow">
          <h3 className="text-lg font-medium mb-2">Contact Support</h3>
          <p className="text-muted-foreground mb-4">Get in touch with our support team</p>
          <Button onClick={openTicketModal} className="w-full bg-primary hover:bg-primary/90 text-white">
            Submit a Ticket
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Tickets</h3>
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">You don't have any recent support tickets.</p>
        </div>
      </div>

      <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit a Support Ticket</DialogTitle>
            <DialogDescription>
              Please provide details about your issue. Our support team will
              get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" defaultValue="John Doe" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="subject" className="text-right mt-2">
                Subject
              </Label>
              <Input id="subject" className="col-span-3" placeholder="Briefly describe your issue" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="message" className="text-right mt-2">
                Message
              </Label>
              <Textarea id="message" className="col-span-3" rows={5} placeholder="Please provide details about your issue..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeTicketModal}>Cancel</Button>
            <Button onClick={handleSubmitTicket} className="bg-primary hover:bg-primary/90 text-white">
              Submit Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSupport;
