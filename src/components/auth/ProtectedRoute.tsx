
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// This component is completely bypassed for development
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Authentication bypassed entirely
  console.log("Protected route accessed - authentication completely bypassed for development");
  
  return <>{children}</>;
};

export default ProtectedRoute;
