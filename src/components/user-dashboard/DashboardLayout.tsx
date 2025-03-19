
import { useState, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import { UserSidebar } from "./UserSidebar";
import { UserTopNav } from "./UserTopNav";
import { OptimizedSuspense } from "@/components/utils/OptimizedSuspense";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const UserDashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <UserTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-4rem)]">
        <UserSidebar 
          isOpen={sidebarOpen} 
          isMobile={isMobile}
          onClose={() => isMobile && setSidebarOpen(false)} 
        />
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-50", // Further reduced duration
            sidebarOpen && !isMobile ? "md:ml-[240px]" : "ml-0", // Match sidebar width
            "p-2 sm:p-3", // Further reduced padding
            "pt-4" // Add extra top padding to avoid navbar overlap
          )}
          role="main"
          aria-label="User Dashboard Main Content"
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

UserDashboardLayout.displayName = 'UserDashboardLayout';
