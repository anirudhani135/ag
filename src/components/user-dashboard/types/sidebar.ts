
import { LucideIcon } from "lucide-react";

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  ariaLabel: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  index: number;
  onKeyDown: (event: React.KeyboardEvent, index: number) => void;
}

export interface UserSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export interface SidebarNavigationProps {
  menuItems: Array<{
    icon: LucideIcon;
    label: string;
    path: string;
    ariaLabel: string;
  }>;
  isCollapsed: boolean;
  isMobile: boolean;
  onClose: () => void;
  currentPath: string;
  onKeyNavigation: (event: React.KeyboardEvent, index: number) => void;
}

export interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  isMobile: boolean;
  onClose: () => void;
}

export interface SidebarFooterProps {
  isCollapsed: boolean;
}

export interface SidebarItemWithTooltipProps extends SidebarItemProps {}
