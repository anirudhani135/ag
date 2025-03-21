
import { memo, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// This component simply forwards to the main DashboardLayout to avoid duplicate UIs
export const UserDashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  useEffect(() => {
    console.warn('UserDashboardLayout is deprecated, use DashboardLayout directly instead');
  }, []);

  return (
    <DashboardLayout type="user">
      {children}
    </DashboardLayout>
  );
});

UserDashboardLayout.displayName = 'UserDashboardLayout';
