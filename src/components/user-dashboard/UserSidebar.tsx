
import { useState, memo } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { userMenuItems } from "./config/menuItems";
import { SearchOverlay } from "../shared/sidebar/SearchOverlay";
import { FloatingCTA } from "../shared/sidebar/FloatingCTA";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarNavigation } from "./components/SidebarNavigation";
import { SidebarFooter } from "./components/SidebarFooter";
import { UserSidebarProps } from "./types/sidebar";

export const UserSidebar = memo(({ isOpen, isMobile, onClose }: UserSidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const handleKeyNavigation = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowUp' && index > 0) {
      const prevItem = document.querySelector(`[data-index="${index - 1}"]`) as HTMLElement;
      prevItem?.focus();
    } else if (event.key === 'ArrowDown' && index < userMenuItems.length - 1) {
      const nextItem = document.querySelector(`[data-index="${index + 1}"]`) as HTMLElement;
      nextItem?.focus();
    }
  };

  return (
    <TooltipProvider>
      <aside 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border",
          "transition-all duration-200 z-40",
          isCollapsed ? "w-14" : "w-[240px]",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isMobile && "shadow-lg"
        )}
        aria-label="User Navigation"
        role="navigation"
      >
        <div className="flex flex-col h-full">
          <SidebarHeader 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            setIsSearchOpen={setIsSearchOpen}
            isMobile={isMobile}
            onClose={onClose}
          />

          <SidebarNavigation 
            menuItems={userMenuItems}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onClose={onClose}
            currentPath={location.pathname}
            onKeyNavigation={handleKeyNavigation}
          />
          
          <SidebarFooter isCollapsed={isCollapsed} />
        </div>

        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Search dashboard..."
        />

        <FloatingCTA
          label="Buy Credits"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => console.log('Buy credits clicked')}
        />
      </aside>
    </TooltipProvider>
  );
});

UserSidebar.displayName = 'UserSidebar';
