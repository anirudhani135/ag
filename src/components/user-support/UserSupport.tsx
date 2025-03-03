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

const UserSupport = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const openTicketModal = () => {
    setIsTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setIsTicketModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Center</h2>
        <Button 
          onClick={openTicketModal} 
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium shadow-sm"
        >
          New Ticket
        </Button>
      </div>

      <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
              <Label htmlFor="message" className="text-right mt-2">
                Message
              </Label>
              <Textarea id="message" className="col-span-3" />
            </div>
          </div>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button type="submit">Submit Ticket</Button>
          </DialogTrigger>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSupport;
