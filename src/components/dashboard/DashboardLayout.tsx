
import { useState, useEffect, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrefetchPages, optimizeTransitions } from "@/lib/instant-navigation";
import { OptimizedSuspense } from "@/components/utils/OptimizedSuspense";
import { useTransitionAnimation } from "@/lib/useTransitionAnimation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  type?: "user" | "developer";
}

export const DashboardLayout = memo(({ children, type = "user" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { userRole, isLoading } = useAuth();
  
  // Add route transition animations
  useTransitionAnimation('.dashboard-content');

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
          <main className="flex-1 p-6 pt-24">
            <div className="space-y-4 max-w-7xl mx-auto">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            "flex-1 overflow-auto transition-all duration-200",
            sidebarOpen && !isMobile ? "md:ml-[240px]" : "ml-0",
            "p-4 md:p-6",
            "pt-20 md:pt-24", // Increased padding to prevent navbar overlap
            "dashboard-content"
          )}
          role="main"
          aria-label={`${type === "developer" ? "Developer" : "User"} Dashboard Main Content`}
        >
          <div className="max-w-7xl mx-auto animate-fade-in">
            <OptimizedSuspense priority="high">
              {children}
            </OptimizedSuspense>
          </div>
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
