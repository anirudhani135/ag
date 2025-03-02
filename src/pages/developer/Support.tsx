
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LifeBuoy, 
  MessageSquare, 
  FileQuestion, 
  Book, 
  ChevronRight, 
  Send,
  Check,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

const DeveloperSupport = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with validation
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "Please sign in to submit a support ticket",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit ticket to Supabase
      const { error } = await supabase.from("support_tickets").insert({
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        user_id: user.id,
      });

      if (error) throw error;

      // Show success message
      toast({
        title: "Ticket submitted successfully",
        description: "We'll get back to you as soon as possible",
        variant: "default",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Failed to submit ticket",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-4 md:p-8 pt-20 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-4">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">Support</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Developer Support</h2>
          <p className="mt-2 text-muted-foreground">Get help with your development needs</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Support Form */}
          <Card className="p-6 md:p-8 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Contact Support</h3>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What is your issue about?" 
                          className="w-full bg-background border-input h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <select
                          className="w-full bg-background border border-input rounded-md h-12 px-3"
                          {...field}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your issue in detail..." 
                          rows={5}
                          className="w-full bg-background border-input min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12
                    shadow-lg hover:shadow-xl transition-all duration-200 relative"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 opacity-0">Submit</span>
                      <svg 
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </Card>

          <div className="space-y-4">
            {/* Documentation Card */}
            <Card className="p-6 bg-card shadow-md hover:shadow-lg transition-all duration-200 
              cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 
                  transition-colors duration-200">
                  <Book className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse our developer guides and API documentation
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* FAQs Card */}
            <Card className="p-6 bg-card shadow-md hover:shadow-lg transition-all duration-200 
              cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 
                  transition-colors duration-200">
                  <FileQuestion className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">FAQs</h4>
                  <p className="text-sm text-muted-foreground">
                    Find answers to common developer questions
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* Community Card */}
            <Card className="p-6 bg-card shadow-md hover:shadow-lg transition-all duration-200 
              cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 
                  transition-colors duration-200">
                  <LifeBuoy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Developer Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with other developers and share knowledge
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
            
            {/* Recent Tickets */}
            <Card className="p-6 bg-card shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium">Recent Tickets</h4>
              </div>
              <div className="text-center text-muted-foreground py-6">
                <p>Your recent support tickets will appear here</p>
                <p className="text-sm mt-1">No tickets found</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSupport;
