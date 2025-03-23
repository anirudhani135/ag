
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Using real AuthContext

interface WithRoleProtectionProps {
  allowedRoles: string[];
}

export const WithRoleProtection = ({ allowedRoles }: WithRoleProtectionProps) => {
  const { user, userRole } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect users to appropriate dashboard based on their role
    return <Navigate to={userRole === "developer" ? "/developer/dashboard" : "/user/dashboard"} />;
  }
  
  return <Outlet />;
};
