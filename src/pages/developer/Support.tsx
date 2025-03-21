
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Search, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FAQSection from "@/components/user-support/components/FAQSection";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  
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
      // Simulate successful submission - actual implementation will integrate with Supabase
      setTimeout(() => {
        toast({
          title: "Ticket submitted successfully",
          description: "We'll get back to you as soon as possible",
          variant: "default",
        });
        
        // Reset form
        form.reset();
        setIsSubmitting(false);
      }, 500); // Reduced timeout for better performance
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Failed to submit ticket",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-4 md:p-6 pt-16 pb-16">
        {/* Header without breadcrumb navigation */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Developer Support</h2>
          <p className="mt-2 text-muted-foreground">Get help with your development needs</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search FAQs..." 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="support">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <FAQSection searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
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
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12"
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSupport;
