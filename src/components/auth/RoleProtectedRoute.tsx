
import React from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
}

const RoleProtectedRoute = ({ children }: RoleProtectedRouteProps) => {
  const { isLoading } = useAuth();

  // During development, just show a loading state if loading
  // But always render the children afterwards
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Always render children regardless of authentication state
  return <>{children}</>;
};

export default RoleProtectedRoute;
