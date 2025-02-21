
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Temporarily disable authentication checks
  return <>{children}</>;
};

export default ProtectedRoute;
