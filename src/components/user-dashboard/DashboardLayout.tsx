
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
            "flex-1 overflow-auto transition-all duration-150",
            sidebarOpen && !isMobile ? "md:ml-60" : "ml-0",
            "p-3 sm:p-4 md:p-5"
          )}
          role="main"
          aria-label="User Dashboard Main Content"
        >
          <OptimizedSuspense priority="high">
            {children}
          </OptimizedSuspense>
        </main>
      </div>
    </div>
  );
});

UserDashboardLayout.displayName = 'UserDashboardLayout';
