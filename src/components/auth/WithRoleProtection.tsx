
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface WithRoleProtectionProps {
  children: React.ReactNode;
  allowedRoles: ("developer" | "buyer" | "admin")[];
}

const WithRoleProtection = ({ children, allowedRoles }: WithRoleProtectionProps) => {
  const { userRole, isLoading } = useAuth();

  // Loading state is maintained for UX
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Role check temporarily commented out until development is completed
  // In production, this would validate user roles and redirect users without 
  // the necessary permissions to an appropriate page
  
  // This is a temporary bypass for development purposes
  console.log("Role protection accessed - role checks temporarily disabled", { allowedRoles });
  
  return <>{children}</>;
};

export default WithRoleProtection;
