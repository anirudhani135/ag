
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Using real AuthContext
import { Loader2 } from "lucide-react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'developer' | 'buyer'>;
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
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
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      </div>
    );
  }

  return user && userRole && allowedRoles.includes(userRole) ? <>{children}</> : null;
};

export default RoleProtectedRoute;
