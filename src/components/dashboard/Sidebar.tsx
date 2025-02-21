
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Settings,
  Share2,
  BarChart2,
  MessageSquare,
  LifeBuoy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Agents", path: "/developer/agents" },
    { icon: DollarSign, label: "Revenue", path: "/revenue" },
    { icon: Share2, label: "Agent API & Integrations", path: "/developer/api" },
    { icon: BarChart2, label: "User Analytics", path: "/analytics" },
    { icon: MessageSquare, label: "Reviews & Feedback", path: "/reviews" },
    { icon: LifeBuoy, label: "Support", path: "/support" },
    { icon: Settings, label: "Settings", path: "/settings" },
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
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">John Developer</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
