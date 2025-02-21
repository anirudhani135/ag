
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} />
        <main className={cn(
          "flex-1 overflow-auto p-6 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-0"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};
