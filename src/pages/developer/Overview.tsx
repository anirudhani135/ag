
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the DeveloperDashboard to improve performance
const DeveloperDashboard = lazy(() => 
  import("@/components/developer/DeveloperDashboard").then(module => ({ 
    default: module.default || module.DeveloperDashboard 
  }))
);

const DeveloperOverview = () => {
  return (
    <DashboardLayout type="developer">
      <Suspense fallback={
        <div className="space-y-6 p-6 animate-pulse">
          <Skeleton className="h-16 w-full" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      }>
        <DeveloperDashboard />
      </Suspense>
    </DashboardLayout>
  );
};

export default DeveloperOverview;
