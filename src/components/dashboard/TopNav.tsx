
import React from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/dashboard/UserNav";
import { NotificationIcon } from "@/components/notifications/NotificationIcon";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TopNavProps {
  showSearch?: boolean;
  onMenuClick?: () => void;
  title?: string;
}

export const TopNav = ({ onMenuClick, title }: TopNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center px-4 border-b bg-background shadow-sm backdrop-blur-sm transition-all duration-200">
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
        <div className={cn(
          "md:ml-4 font-semibold transition-all duration-200",
          "bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
        )}>
          {title}
        </div>
      )}
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          onClick={() => navigate('/marketplace')}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Marketplace</span>
        </Button>
        <NotificationIcon />
        <UserNav />
      </div>
    </div>
  );
};
