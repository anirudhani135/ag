
import { useState, useEffect, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrefetchPages, optimizeTransitions } from "@/lib/instant-navigation";
import { OptimizedSuspense } from "@/components/utils/OptimizedSuspense";

interface DashboardLayoutProps {
  children: React.ReactNode;
  type?: "user" | "developer";
}

// Create a memoized component to prevent unnecessary re-renders
const DashboardLayoutContent = memo(({ 
  children, 
  type, 
  sidebarOpen, 
  isMobile, 
  setSidebarOpen 
}: DashboardLayoutProps & { 
  sidebarOpen: boolean; 
  isMobile: boolean; 
  setSidebarOpen: (open: boolean) => void; 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={sidebarOpen} 
          isMobile={isMobile}
          onClose={() => isMobile && setSidebarOpen(false)} 
          type={type}
        />
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-50", // Further reduced duration
            sidebarOpen && !isMobile ? "md:ml-[240px]" : "ml-0", // Fixed spacing to match sidebar width
            "p-2 sm:p-3", // Reduced padding for less clutter
            "pt-20" // Increased top padding to prevent navbar overlap
          )}
          role="main"
          aria-label={`${type === "developer" ? "Developer" : "User"} Dashboard Main Content`}
        >
          <div className="mt-2">
            <OptimizedSuspense priority="high">
              {children}
            </OptimizedSuspense>
          </div>
        </main>
      </div>
    </div>
  );
});

DashboardLayoutContent.displayName = 'DashboardLayoutContent';

export const DashboardLayout = memo(({ children, type = "user" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { userRole, isLoading } = useAuth();

  // Prefetch likely routes based on the dashboard type to improve perceived performance
  const routesToPrefetch = type === "developer" 
    ? ['/developer/analytics', '/developer/agents', '/developer/revenue', '/developer/overview'] 
    : ['/user/analytics', '/user/agents', '/user/notifications', '/user/overview'];
  
  usePrefetchPages(routesToPrefetch);
  
  // Enable optimized transitions when navigating
  useEffect(() => {
    return optimizeTransitions();
  }, []);

  // Handle resize with useCallback to prevent recreation on each render
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b">
          <Skeleton className="h-full" />
        </div>
        <div className="flex h-[calc(100vh-4rem)]">
          <Skeleton className="w-60 hidden md:block" />
          <main className="flex-1 p-3 pt-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayoutContent
      children={children}
      type={type}
      sidebarOpen={sidebarOpen}
      isMobile={isMobile}
      setSidebarOpen={setSidebarOpen}
    />
  );
});

DashboardLayout.displayName = 'DashboardLayout';
