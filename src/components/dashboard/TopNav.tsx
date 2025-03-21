
import React from "react";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/dashboard/ModeToggle";
import { UserNav } from "@/components/dashboard/UserNav";
import { NotificationIcon } from "@/components/notifications/NotificationIcon";

interface TopNavProps {
  showSearch?: boolean;
}

export const TopNav = ({ showSearch = true }: TopNavProps) => {
  return (
    <div className="flex h-16 items-center px-4 border-b bg-background">
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
