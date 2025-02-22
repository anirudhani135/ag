
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  ariaLabel: string;
}

export interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  type: "user" | "developer";
}

export interface UserProfileProps {
  isCollapsed: boolean;
  type: "user" | "developer";
}

export interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  setIsSearchOpen: (value: boolean) => void;
  isMobile: boolean;
}

export interface NavigationMenuProps {
  menuItems: MenuItem[];
  isCollapsed: boolean;
  isMobile: boolean;
  onClose: () => void;
}
