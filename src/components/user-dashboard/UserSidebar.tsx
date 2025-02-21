
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  Bot,
  CreditCard,
  BarChart2,
  MessageSquare,
  LifeBuoy,
  Settings,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

export const UserSidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: Bot, label: "My Agents", path: "/dashboard/agents" },
    { icon: CreditCard, label: "Credits", path: "/dashboard/credits" },
    { icon: Star, label: "Saved Agents", path: "/dashboard/saved" },
    { icon: BarChart2, label: "Analytics", path: "/dashboard/analytics" },
    { icon: MessageSquare, label: "Reviews", path: "/dashboard/reviews" },
    { icon: LifeBuoy, label: "Support", path: "/dashboard/support" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" }
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-64"
      )}
    >
      <div className="flex flex-col h-full py-4">
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/10 transition-colors",
                    location.pathname === item.path 
                      ? "bg-accent/20 text-accent font-medium" 
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
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
