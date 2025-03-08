
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "../dashboard/DashboardLayout";

export const ProtectedRoute = () => {
  // During development, bypass authentication check - set to true for development
  const isDevelopment = true; // DEVELOPMENT MODE: Set to false in production
  const { user } = useAuth();

  // If authenticated or in development mode, render the outlet
  if (user || isDevelopment) {
    return <Outlet />;
  }

  // If not authenticated and not in development mode, redirect to login
  return <Navigate to="/auth/login" />;
};
