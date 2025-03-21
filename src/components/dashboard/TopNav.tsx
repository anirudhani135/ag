
import React from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/dashboard/ModeToggle";
import { UserNav } from "@/components/dashboard/UserNav";
import { NotificationIcon } from "@/components/notifications/NotificationIcon";

interface TopNavProps {
  showSearch?: boolean;
  onMenuClick?: () => void;
  title?: string;
}

export const TopNav = ({ showSearch = true, onMenuClick, title }: TopNavProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center px-4 border-b bg-background">
      {onMenuClick && (
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      
      {title && (
        <div className="md:hidden font-semibold">{title}</div>
      )}
      
      <div className="flex-1">
        {showSearch && (
          <div className="relative hidden md:flex items-center w-full max-w-sm">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full py-2 pl-8 pr-3 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <NotificationIcon />
        <ModeToggle />
        <UserNav />
      </div>
    </div>
  );
};
