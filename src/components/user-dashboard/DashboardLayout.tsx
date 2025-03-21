
import { memo, useEffect } from "react";
import { DashboardLayout as MainDashboardLayout } from "@/components/dashboard/DashboardLayout";

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

// This file is now deprecated - just redirects to the main DashboardLayout
export const UserDashboardLayout = memo(({ children }: UserDashboardLayoutProps) => {
  useEffect(() => {
    console.warn('This UserDashboardLayout component is deprecated, use DashboardLayout from @/components/dashboard/DashboardLayout instead');
  }, []);

  return (
    <MainDashboardLayout type="user">
      {children}
    </MainDashboardLayout>
  );
});

UserDashboardLayout.displayName = 'UserDashboardLayout';
