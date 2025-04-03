
import { useState, useEffect, useCallback, memo, Suspense, lazy } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrefetchPages, optimizeTransitions } from "@/lib/instant-navigation";
import { OptimizedSuspense } from "@/components/utils/OptimizedSuspense";
import { useTransitionAnimation } from "@/lib/useTransitionAnimation";
import { useLocation } from "react-router-dom";

// Lazy load components that might not be needed immediately
const PreloadLinks = lazy(() => import('@/components/utils/PreloadLinks'));

interface DashboardLayoutProps {
  children: React.ReactNode;
  type?: "user" | "developer";
}

export const DashboardLayout = memo(({ children, type = "user" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isLoading } = useAuth();
  const location = useLocation();
  
  // Determine the current page title based on the path
  const getPageTitle = useCallback(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('agents')) return 'Agents';
    if (path.includes('revenue')) return 'Revenue';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('support')) return 'Support';
    if (path.includes('reviews')) return 'Reviews';
    if (path.includes('credits')) return 'Credits';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('api-integrations')) return 'API & Integrations';
    if (path.includes('usage-history')) return 'Usage History';
    return type === 'developer' ? 'Developer Portal' : 'User Dashboard';
  }, [location.pathname, type]);
  
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
    if (!mobile && !sidebarOpen) {
      // Only set sidebar open if it's not already open
      setSidebarOpen(true);
    } else if (mobile && sidebarOpen) {
      // Only close sidebar on mobile if it's currently open
      setSidebarOpen(false);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    handleResize();
    
    // Use requestAnimationFrame for smoother resize handling
    let frameId: number;
    let lastWidth = window.innerWidth;
    
    const onResize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        // Only handle resize if width actually changed (ignore height changes)
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          handleResize();
        }
      });
    };
    
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
    };
  }, [handleResize]);

  // Loading skeleton with improved visual appeal
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b bg-gradient-to-r from-background to-blue-50/30 animate-pulse">
          <Skeleton className="h-full opacity-30" />
        </div>
        <div className="flex h-[calc(100vh-4rem)]">
          <Skeleton className="w-60 hidden md:block opacity-30" />
          <main className="flex-1 p-4 md:p-6 pt-20 md:pt-24">
            <div className="space-y-4 max-w-7xl mx-auto">
              <Skeleton className="h-8 w-[200px] opacity-40" />
              <Skeleton className="h-4 w-[300px] opacity-30" />
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 opacity-20 hover:opacity-30 transition-opacity" />
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
      <TopNav 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        title={getPageTitle()}
      />
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
            "dashboard-content will-change-auto"
          )}
          role="main"
          aria-label={`${type === "developer" ? "Developer" : "User"} Dashboard Main Content`}
        >
          <div className="max-w-7xl mx-auto animate-fade-in w-full">
            <Suspense fallback={
              <div className="space-y-4 w-full">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
      
      {/* Preload critical resources */}
      <Suspense fallback={null}>
        <PreloadLinks />
      </Suspense>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
