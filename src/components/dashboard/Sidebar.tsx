import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  CreditCard, 
  User,
  History,
  Settings,
  Star,
  Activity
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Activity, label: "Overview", path: "/dashboard" },
    { icon: CreditCard, label: "Credits", path: "/dashboard/credits" },
    { icon: History, label: "Usage History", path: "/dashboard/usage" },
    { icon: Star, label: "Saved Agents", path: "/dashboard/saved" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-border transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-64'
      }`}
    >
      <nav className="h-full py-4">
        <div className="px-4 pb-4 mb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">User Dashboard</p>
              <p className="text-xs text-muted-foreground">Manage your account</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm hover:bg-accent/10 ${
                  location.pathname === item.path ? 'bg-accent/20 text-accent' : 'text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};