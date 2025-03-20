
// This file is kept for compatibility but no longer renders a sidebar
// It redirects to the main sidebar component

import { memo } from "react";
import { UserSidebarProps } from "./types/sidebar";

export const UserSidebar = memo(({ isOpen, isMobile, onClose }: UserSidebarProps) => {
  // This component is deprecated and should not be used directly
  // Use DashboardLayout from the dashboard folder instead
  console.warn('UserSidebar is deprecated, use DashboardLayout instead');
  
  return null; // Return null to prevent rendering anything
});

UserSidebar.displayName = 'UserSidebar';
