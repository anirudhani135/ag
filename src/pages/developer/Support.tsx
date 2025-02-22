
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, MessageSquare, FileQuestion, Book } from "lucide-react";

const DeveloperSupport = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Developer Support</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Contact Support</h3>
            </div>
            <form className="space-y-4">
              <div>
                <Input placeholder="Subject" />
              </div>
              <div>
                <Textarea placeholder="Describe your issue..." rows={5} />
              </div>
              <Button>Submit Ticket</Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-4 hover:bg-accent/5 transition-colors cursor-pointer">
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

            <Card className="p-4 hover:bg-accent/5 transition-colors cursor-pointer">
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

            <Card className="p-4 hover:bg-accent/5 transition-colors cursor-pointer">
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
