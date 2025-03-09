
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface WithRoleProtectionProps {
  allowedRoles: string[];
}

export const WithRoleProtection = ({ allowedRoles }: WithRoleProtectionProps) => {
  // During development, always bypass role check
  const isDevelopment = true; // DEVELOPMENT MODE: Set to true for testing, set to false in production
  const { user, userRole } = useAuth();

  if (isDevelopment) {
    return <Outlet />;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect users to appropriate dashboard based on their role
    return <Navigate to={userRole === "developer" ? "/developer/dashboard" : "/user/dashboard"} />;
  }

  return <Outlet />;
};
