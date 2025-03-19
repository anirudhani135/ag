
import { useState, memo } from "react";
import { X, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FloatingCTA } from "../shared/sidebar/FloatingCTA";
import { SearchOverlay } from "../shared/sidebar/SearchOverlay";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProps } from "./types/sidebar";
import { userMenuItems, developerMenuItems } from "./config/menuItems";
import { SidebarHeader } from "./components/SidebarHeader";
import { NavigationMenu } from "./components/NavigationMenu";
import { UserProfile } from "./components/UserProfile";

export const Sidebar = memo(({ isOpen, isMobile, onClose, type }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const menuItems = type === "developer" ? developerMenuItems : userMenuItems;
  const ctaConfig = type === "developer" 
    ? {
        label: "Withdraw Funds",
        icon: <DollarSign className="h-4 w-4" />,
        onClick: () => console.log('Withdraw funds clicked'),
      }
    : {
        label: "Buy Credits",
        icon: <DollarSign className="h-4 w-4" />,
        onClick: () => console.log('Buy credits clicked'),
      };

  return (
    <TooltipProvider>
      <aside 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border",
          "transition-transform duration-150 z-40", // Reduced duration for snappier feel
          isCollapsed ? "w-16" : "w-60", // Reduced from 64 to 60 for better alignment
          isOpen ? "translate-x-0" : "-translate-x-full",
          isMobile && "shadow-lg"
        )}
        aria-label={`${type === "developer" ? "Developer" : "User"} Navigation`}
        role="navigation"
      >
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 md:hidden"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="flex flex-col h-full py-3">
          <SidebarHeader
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            setIsSearchOpen={setIsSearchOpen}
            isMobile={isMobile}
          />

          <NavigationMenu
            menuItems={menuItems}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onClose={onClose}
          />

          <UserProfile
            isCollapsed={isCollapsed}
            type={type}
          />
        </div>

        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          placeholder={`Search ${type === "developer" ? "agents, analytics, or settings" : "agents, transactions, or settings"}...`}
        />

        <FloatingCTA
          label={ctaConfig.label}
          icon={ctaConfig.icon}
          onClick={ctaConfig.onClick}
          type={type}
        />
      </aside>
    </TooltipProvider>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
