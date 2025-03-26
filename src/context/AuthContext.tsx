import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType } from "@/types/auth";

// Create the context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const MOCK_USER: User = {
  id: 'dev-user-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'dev@example.com',
  role: null
};

const MOCK_SESSION: Session = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  user: MOCK_USER,
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER); // Default to mock user
  const [session, setSession] = useState<Session | null>(MOCK_SESSION); // Default to mock session
  const [isLoading, setIsLoading] = useState(false); // Set to false initially to skip loading state
  const { toast } = useToast();

  // Sign in function - in development mode, just return success
  const signIn = async (email: string, password: string) => {
    try {
      toast({
        title: "Development mode",
        description: "Authentication is bypassed in development mode",
      });
      
      return { user: MOCK_USER, session: MOCK_SESSION };
    } catch (error: any) {
      console.log("Sign-in bypassed in development mode");
      return { user: MOCK_USER, session: MOCK_SESSION };
    }
  };

  // Sign up function - in development mode, just return success
  const signUp = async (email: string, password: string) => {
    try {
      toast({
        title: "Development mode",
        description: "Registration is bypassed in development mode",
      });
      
      return { user: MOCK_USER, session: MOCK_SESSION };
    } catch (error: any) {
      console.log("Sign-up bypassed in development mode");
      return { user: MOCK_USER, session: MOCK_SESSION };
    }
  };

  // Sign out function - in development mode, does nothing
  const signOut = async () => {
    try {
      toast({
        title: "Development mode",
        description: "Sign out is bypassed in development mode",
      });
    } catch (error: any) {
      console.log("Sign-out bypassed in development mode");
    }
  };

  // In development mode, we're skipping the Supabase auth
  // For production, you would re-enable this code
  /*
  useEffect(() => {
    // Set up auth state listener and check for existing session
    // ... original auth code here ...
  }, []);
  */

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
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
