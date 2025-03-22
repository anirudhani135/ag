
import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { Loader2 } from "lucide-react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'developer' | 'buyer'>;
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  // DEVELOPMENT MODE: Role protection disabled for development
  // Uncomment the below code for production use
  
  /*
  const { user, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth/login");
    } else if (!isLoading && user && userRole && !allowedRoles.includes(userRole)) {
      navigate("/dashboard");
      console.log(`Access denied: User role ${userRole} not in allowed roles:`, allowedRoles);
    }
  }, [user, isLoading, userRole, navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return user && userRole && allowedRoles.includes(userRole) ? <>{children}</> : null;
  */
  
  console.log("DEVELOPMENT MODE: Role protection bypassed for", allowedRoles);
  return <>{children}</>;
};

export default RoleProtectedRoute;
