
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const WithRoleProtection = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'developer' | 'buyer')[];
}) => {
  // During development, bypass role check
  const isDevelopment = true; // Set to true during development, false in production
  const { userRole } = useAuth();

  // If user has allowed role or in development mode, render children
  if (isDevelopment || (userRole && allowedRoles.includes(userRole))) {
    return <>{children}</>;
  }

  // If user doesn't have allowed role and not in development mode, redirect to dashboard
  return <Navigate to="/dashboard" />;
};
