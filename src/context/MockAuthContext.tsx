
import { createContext, useContext, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Create the same interface as in the real AuthContext
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: 'admin' | 'developer' | 'buyer' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

// Create a mock context with the same shape as the real one
const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user and session objects for development
const mockUser: User = {
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: null,
  email: 'dev@example.com',
};

const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: mockUser,
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
};

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(mockUser);
  const [session] = useState<Session | null>(mockSession);
  const [isLoading] = useState(false);
  const [userRole] = useState<'admin' | 'developer' | 'buyer' | null>('developer');
  const { toast } = useToast();

  // Mock implementation of auth methods
  const signIn = async () => {
    toast({
      title: "Development mode",
      description: "Authentication is bypassed in development mode",
    });
  };

  const signUp = async () => {
    toast({
      title: "Development mode",
      description: "Authentication is bypassed in development mode",
    });
  };

  const signOut = async () => {
    toast({
      title: "Development mode",
      description: "Authentication is bypassed in development mode",
    });
  };

  const refreshUserRole = async () => {
    console.log("DEVELOPMENT MODE: Role refresh bypassed");
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

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

// Export the same hook interface as the real one
export function useAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a MockAuthProvider");
  }
  return context;
}
