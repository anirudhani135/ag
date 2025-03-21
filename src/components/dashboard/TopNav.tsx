
import React from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserNav } from "@/components/dashboard/UserNav";
import { NotificationIcon } from "@/components/notifications/NotificationIcon";
import Logo from "@/components/Logo";

interface TopNavProps {
  showSearch?: boolean;
  onMenuClick?: () => void;
  title?: string;
}

export const TopNav = ({ onMenuClick, title }: TopNavProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center px-4 border-b bg-background">
      {onMenuClick && (
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      
      <div className="flex items-center">
        <Logo />
      </div>
      
      {title && (
        <div className="md:ml-4 font-semibold">{title}</div>
      )}
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-3">
        <NotificationIcon />
        <ModeToggle />
        <UserNav />
      </div>
    </div>
  );
};
