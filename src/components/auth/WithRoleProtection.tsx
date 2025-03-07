
import { ReactNode } from "react";

interface WithRoleProtectionProps {
  children: ReactNode;
  allowedRoles: ("developer" | "buyer" | "admin")[];
}

// This component completely bypasses role protection for development
const WithRoleProtection = ({ children }: WithRoleProtectionProps) => {
  // Role protection bypassed entirely
  console.log("Role protection completely bypassed for development");
  
  return <>{children}</>;
};

export default WithRoleProtection;
