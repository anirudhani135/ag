
import { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthOperations } from "@/hooks/useAuthOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, isLoading, userRole, refreshUserRole } = useAuthState();
  const { signIn, signUp, signOut: signOutOperation } = useAuthOperations();
  
  // Wrap signOut to provide the user ID
  const signOut = async () => {
    await signOutOperation(user?.id);
  };

  const value = {
    user,
    session,
    isLoading,
    userRole,
    signIn,
    signUp,
    signOut,
    refreshUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
