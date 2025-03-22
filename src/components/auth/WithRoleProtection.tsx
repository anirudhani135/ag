
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/MockAuthContext"; // Changed from AuthContext to MockAuthContext

interface WithRoleProtectionProps {
  allowedRoles: string[];
}

export const WithRoleProtection = ({ allowedRoles }: WithRoleProtectionProps) => {
  // DEVELOPMENT MODE: Role protection disabled for development
  // Uncomment the below code for production use
  
  /*
  const { user, userRole } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect users to appropriate dashboard based on their role
    return <Navigate to={userRole === "developer" ? "/developer/dashboard" : "/user/dashboard"} />;
  }
  */
  
  console.log("DEVELOPMENT MODE: Role protection bypassed for", allowedRoles);
  return <Outlet />;
};
