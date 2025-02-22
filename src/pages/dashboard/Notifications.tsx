
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          Stay updated with your latest notifications
        </p>
        {/* Notifications list will be implemented here */}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
