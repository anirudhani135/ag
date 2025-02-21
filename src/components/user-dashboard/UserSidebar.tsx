
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  Bot,
  CreditCard,
  BarChart2,
  MessageSquare,
  LifeBuoy,
  Settings,
  Star,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FloatingCTA } from "../shared/sidebar/FloatingCTA";
import { SearchOverlay } from "../shared/sidebar/SearchOverlay";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export const UserSidebar = ({ isOpen, isMobile, onClose }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const menuItems = [
    { 
      icon: Home, 
      label: "Overview", 
      path: "/dashboard",
      ariaLabel: "Go to Dashboard Overview"
    },
    { 
      icon: Bot, 
      label: "My Agents", 
      path: "/dashboard/agents",
      ariaLabel: "View My AI Agents"
    },
    { 
      icon: CreditCard, 
      label: "Credits", 
      path: "/dashboard/credits",
      ariaLabel: "Manage Credits and Transactions"
    },
    { 
      icon: Star, 
      label: "Saved Agents", 
      path: "/dashboard/saved",
      ariaLabel: "View Saved Agents"
    },
    { 
      icon: BarChart2, 
      label: "Analytics", 
      path: "/dashboard/analytics",
      ariaLabel: "View Usage Analytics"
    },
    { 
      icon: MessageSquare, 
      label: "Reviews", 
      path: "/dashboard/reviews",
      ariaLabel: "Manage Reviews"
    },
    { 
      icon: LifeBuoy, 
      label: "Support", 
      path: "/dashboard/support",
      ariaLabel: "Access Support"
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/dashboard/settings",
      ariaLabel: "Manage Account Settings"
    }
  ];

  const handleKeyNavigation = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowUp' && index > 0) {
      const prevItem = document.querySelector(`[data-index="${index - 1}"]`) as HTMLElement;
      prevItem?.focus();
    } else if (event.key === 'ArrowDown' && index < menuItems.length - 1) {
      const nextItem = document.querySelector(`[data-index="${index + 1}"]`) as HTMLElement;
      nextItem?.focus();
    }
  };

  return (
    <TooltipProvider>
      <aside 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border",
          "transition-all duration-300 z-40",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isMobile && "shadow-lg",
          "md:rounded-lg md:shadow-md"
        )}
        aria-label="User Navigation"
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

        <div className="flex flex-col h-full py-4">
          <div className="px-4 mb-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hover:bg-accent/10"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="Toggle dark mode"
            />
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hover:bg-accent/10"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <nav className="flex-1">
            <ul className="space-y-1" role="menu">
              {menuItems.map((item, index) => (
                <li key={item.path} role="none">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200",
                          "hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                          "relative",
                          location.pathname === item.path && [
                            "bg-accent/20 text-accent font-medium",
                            "before:absolute before:left-0 before:top-0 before:h-full",
                            "before:w-1 before:bg-accent before:rounded-r"
                          ]
                        )}
                        onClick={() => isMobile && onClose()}
                        role="menuitem"
                        aria-label={item.ariaLabel}
                        aria-current={location.pathname === item.path ? "page" : undefined}
                        data-index={index}
                        onKeyDown={(e) => handleKeyNavigation(e, index)}
                      >
                        <item.icon 
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            "hover:scale-110"
                          )}
                          aria-hidden="true"
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="px-4 py-4 mt-auto border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium">John User</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Find an agent or setting..."
        />

        {/* Floating CTA */}
        <FloatingCTA
          label="Buy Credits"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => console.log('Buy credits clicked')}
        />
      </aside>
    </TooltipProvider>
  );
};
