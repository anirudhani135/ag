
import { useAuth } from "@/context/AuthContext";

interface WithRoleProtectionProps {
  children: React.ReactNode;
  allowedRoles: ("developer" | "buyer" | "admin")[];
}

const WithRoleProtection = ({ children, allowedRoles }: WithRoleProtectionProps) => {
  // Role checks are completely bypassed during development
  // IMPORTANT: This should be properly implemented before production
  console.log("Role protection bypassed for development", { allowedRoles });
  
  return <>{children}</>;
};

export default WithRoleProtection;
