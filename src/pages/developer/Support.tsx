import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, MessageSquare, FileQuestion, Book } from "lucide-react";

const DeveloperSupport = () => {
  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen space-y-8 p-8 pt-16 pb-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Developer Support</h2>
          <p className="mt-2 text-muted-foreground">Get help with your development needs</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-8 bg-card shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Contact Support</h3>
            </div>
            <form className="space-y-6">
              <div className="space-y-2">
                <Input 
                  placeholder="Subject" 
                  className="w-full bg-background border-input"
                />
              </div>
              <div className="space-y-2">
                <Textarea 
                  placeholder="Describe your issue..." 
                  rows={5}
                  className="w-full bg-background border-input min-h-[120px] resize-none"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
              >
                Submit Ticket
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-6 bg-card shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <Book className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse our developer guides and API documentation
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <FileQuestion className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium">FAQs</h4>
                  <p className="text-sm text-muted-foreground">
                    Find answers to common developer questions
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <LifeBuoy className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium">Developer Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with other developers and share knowledge
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSupport;
