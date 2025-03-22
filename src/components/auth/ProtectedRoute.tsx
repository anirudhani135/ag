
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// import { useLocation, Navigate } from "react-router-dom";
// import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  // DEVELOPMENT MODE: Auth check disabled for development
  // Using MockAuthProvider during development
  const { user } = useAuth();
  
  // Log authentication status but proceed regardless in development mode
  console.log("DEVELOPMENT MODE: Authentication check bypassed", { 
    userAuthenticated: !!user,
    userId: user?.id 
  });
  
  return <Outlet />;
  
  /* PRODUCTION CODE (commented out during development)
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authenticated, render the outlet
  if (user) {
    return <Outlet />;
  }

  // If not authenticated, redirect to login with return path
  return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  */
};
