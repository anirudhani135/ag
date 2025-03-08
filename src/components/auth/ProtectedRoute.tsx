
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "../dashboard/DashboardLayout";

export const ProtectedRoute = () => {
  // During development, bypass authentication check
  const isDevelopment = true; // Set to true during development, false in production
  const { user } = useAuth();

  // If authenticated or in development mode, render the outlet
  if (user || isDevelopment) {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  }

  // If not authenticated and not in development mode, redirect to login
  return <Navigate to="/auth/login" />;
};
