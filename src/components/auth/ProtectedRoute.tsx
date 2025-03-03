
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Authentication checks are commented out until development is completed
  // In a production environment, this would validate user authentication
  // and redirect unauthenticated users to the login page
  return <>{children}</>;
};

export default ProtectedRoute;
