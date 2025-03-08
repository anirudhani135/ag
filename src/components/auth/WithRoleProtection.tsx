
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type WithRoleProtectionProps = {
  allowedRoles: ('admin' | 'developer' | 'buyer')[];
}

export const WithRoleProtection = ({ allowedRoles }: WithRoleProtectionProps) => {
  // During development, always bypass role check
  const isDevelopment = true; // Always true during development, set to false in production
  const { userRole } = useAuth();

  // If user has allowed role or in development mode, render children
  if (isDevelopment || (userRole && allowedRoles.includes(userRole))) {
    return <Outlet />;
  }

  // If user doesn't have allowed role and not in development mode, redirect to dashboard
  return <Navigate to="/dashboard" />;
};
