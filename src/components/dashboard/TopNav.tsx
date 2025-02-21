
import { Menu, Bell, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  onMenuClick: () => void;
}

export const TopNav = ({ onMenuClick }: TopNavProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Agent
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
