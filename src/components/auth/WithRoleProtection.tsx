
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface WithRoleProtectionProps {
  children: React.ReactNode;
  allowedRoles: ("developer" | "buyer" | "admin")[];
}

const WithRoleProtection = ({ children, allowedRoles }: WithRoleProtectionProps) => {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
};

export default WithRoleProtection;
