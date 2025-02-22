
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  type?: "user" | "developer";
}

export const DashboardLayout = ({ children, type = "user" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { userRole, isLoading } = useAuth();

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

  // Redirect if user tries to access wrong dashboard type
  if (!isLoading && ((type === "developer" && userRole !== "developer") || 
      (type === "user" && userRole === "developer"))) {
    return <Navigate to={userRole === "developer" ? "/developer/dashboard" : "/user/dashboard"} />;
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
            "flex-1 overflow-auto p-6 transition-all duration-300",
            sidebarOpen && !isMobile ? "md:ml-64" : "ml-0"
          )}
          role="main"
          aria-label={`${type === "developer" ? "Developer" : "User"} Dashboard Main Content`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
