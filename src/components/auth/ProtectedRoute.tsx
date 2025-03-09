
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = () => {
  // During development, always bypass authentication check
  const isDevelopment = true; // DEVELOPMENT MODE: Set to true for testing, set to false in production
  const { user } = useAuth();

  // If authenticated or in development mode, render the outlet
  if (user || isDevelopment) {
    return <Outlet />;
  }

  // If not authenticated and not in development mode, redirect to login
  return <Navigate to="/auth/login" />;
};
