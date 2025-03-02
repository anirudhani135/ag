
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { NotificationsCenter } from "@/components/dashboard/NotificationsCenter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, CheckCheck } from "lucide-react";

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with important events and information
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Unread
            </TabsTrigger>
            <TabsTrigger value="read" className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4" />
              Read
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <NotificationsCenter filterType="all" />
          </TabsContent>
          
          <TabsContent value="unread" className="mt-0">
            <NotificationsCenter filterType="unread" />
          </TabsContent>
          
          <TabsContent value="read" className="mt-0">
            <NotificationsCenter filterType="read" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
