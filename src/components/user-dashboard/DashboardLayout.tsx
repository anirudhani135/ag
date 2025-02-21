
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserSidebar } from "./UserSidebar";
import { UserTopNav } from "./UserTopNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const UserDashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
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
            "flex-1 overflow-auto p-6 transition-all duration-300",
            sidebarOpen && !isMobile ? "md:ml-64" : "ml-0"
          )}
          role="main"
          aria-label="User Dashboard Main Content"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
