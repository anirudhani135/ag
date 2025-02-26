
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, MessageSquare, FileQuestion, Book, ChevronRight } from "lucide-react";

const DeveloperSupport = () => {
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
            <form className="space-y-6">
              <div className="space-y-2">
                <Input 
                  placeholder="Subject" 
                  className="w-full bg-background border-input h-12"
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
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12
                  shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Submit Ticket
              </Button>
            </form>
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSupport;
