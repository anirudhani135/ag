
import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { OptimizedSuspense } from "@/components/utils/OptimizedSuspense";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const UserDashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  // Memoized fallback content
  const renderFallback = useCallback(() => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-32 bg-muted rounded"></div>
      <div className="h-32 bg-muted rounded"></div>
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-background">
      <main 
        className="flex-1 overflow-auto p-4 md:p-6"
        role="main"
        aria-label="User Dashboard Main Content"
      >
        <div className="max-w-7xl mx-auto">
          <OptimizedSuspense 
            priority="high" 
            fallback={renderFallback()}
          >
            {children}
          </OptimizedSuspense>
        </div>
      </main>
    </div>
  );
});

UserDashboardLayout.displayName = 'UserDashboardLayout';
