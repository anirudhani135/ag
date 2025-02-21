
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users,
  DollarSign,
  Settings,
  Share2,
  BarChart2,
  MessageSquare,
  LifeBuoy,
  X,
  Search,
  ChevronRight,
  ChevronLeft
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

export const Sidebar = ({ isOpen, isMobile, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/developer", 
      ariaLabel: "Go to Developer Dashboard Overview"
    },
    { 
      icon: Users, 
      label: "Agents", 
      path: "/developer/agents",
      ariaLabel: "Manage Your AI Agents"
    },
    { 
      icon: DollarSign, 
      label: "Revenue", 
      path: "/developer/revenue",
      ariaLabel: "View Revenue Analytics"
    },
    { 
      icon: Share2, 
      label: "API & Integrations", 
      path: "/developer/api",
      ariaLabel: "Access API and Integration Tools"
    },
    { 
      icon: BarChart2, 
      label: "Analytics", 
      path: "/developer/analytics",
      ariaLabel: "View User Analytics"
    },
    { 
      icon: MessageSquare, 
      label: "Reviews", 
      path: "/developer/reviews",
      ariaLabel: "Manage User Reviews and Feedback"
    },
    { 
      icon: LifeBuoy, 
      label: "Support", 
      path: "/developer/support",
      ariaLabel: "Access Developer Support"
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/developer/settings",
      ariaLabel: "Manage Developer Settings"
    }
  ];

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
        aria-label="Developer Navigation"
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
          
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-accent" aria-hidden="true" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium">John Developer</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Search agents, analytics, or settings..."
        />

        <FloatingCTA
          label="Withdraw Funds"
          icon={<DollarSign className="h-4 w-4" />}
          onClick={() => console.log('Withdraw funds clicked')}
        />
      </aside>
    </TooltipProvider>
  );
};
