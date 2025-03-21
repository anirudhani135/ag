
import { memo, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// This component is deprecated - just wraps the main DashboardLayout for compatibility
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
