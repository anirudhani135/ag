
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Authentication checks are completely bypassed during development
  // IMPORTANT: This should be properly implemented before production
  console.log("Protected route accessed - authentication checks disabled for development");
  
  return <>{children}</>;
};

export default ProtectedRoute;
