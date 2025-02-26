
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, MessageSquare, FileQuestion, Book } from "lucide-react";

const DeveloperSupport = () => {
  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen space-y-6 p-8 pt-16 pb-16">
        <h2 className="text-3xl font-bold tracking-tight">Developer Support</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-8 bg-white shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Contact Support</h3>
            </div>
            <form className="space-y-6">
              <div>
                <Input 
                  placeholder="Subject" 
                  className="bg-white border-gray-200"
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Describe your issue..." 
                  rows={5}
                  className="bg-white border-gray-200 resize-none"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Submit Ticket
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-6 bg-white shadow-md hover:bg-gray-50 transition-colors cursor-pointer">
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

            <Card className="p-6 bg-white shadow-md hover:bg-gray-50 transition-colors cursor-pointer">
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

            <Card className="p-6 bg-white shadow-md hover:bg-gray-50 transition-colors cursor-pointer">
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
