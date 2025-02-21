
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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export const UserSidebar = ({ isOpen, isMobile, onClose }: SidebarProps) => {
  const location = useLocation();
  
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

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border transition-transform duration-300 z-40",
        isOpen ? "translate-x-0" : "-translate-x-64",
        isMobile && "shadow-lg"
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
        <nav className="flex-1">
          <ul className="space-y-1" role="menu">
            {menuItems.map((item) => (
              <li key={item.path} role="none">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                    "hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                    location.pathname === item.path 
                      ? "bg-accent/20 text-accent font-medium" 
                      : "text-muted-foreground"
                  )}
                  onClick={() => isMobile && onClose()}
                  role="menuitem"
                  aria-label={item.ariaLabel}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
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
            <div>
              <p className="text-sm font-medium">John User</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
