
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { handleSupabaseError } from "@/utils/errorHandling";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'developer' | 'buyer' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching role for user ID:", userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      console.log("Fetched role data:", data);
      return data?.role || null;
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return null;
    }
  };

  const refreshUserRole = async () => {
    if (!user) return;
    const role = await fetchUserRole(user.id);
    setUserRole(role);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        console.log("User role:", role);
        setUserRole(role);
        
        // Log activity if login event
        if (event === 'SIGNED_IN') {
          try {
            await supabase.from('user_activity').insert({
              user_id: session.user.id,
              activity_type: 'Login',
              metadata: {
                timestamp: new Date().toISOString(),
                status: 'completed'
              }
            });
          } catch (error) {
            console.error('Error logging login activity:', error);
          }
        }
      } else {
        setUserRole(null);
      }
      
      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      // Auth state change will trigger role fetch and redirect
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) {
        throw new Error("Failed to retrieve user after sign in");
      }
      
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();
      
      if (data?.role === 'developer') {
        navigate("/developer/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user was created successfully
      if (!data.user) {
        throw new Error("Failed to create user account");
      }
      
      // Assign buyer role to new users
      try {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'buyer'
          });
        
        if (roleError) {
          console.error("Error assigning role:", roleError);
          throw roleError;
        }
        
        // Create a profile entry for the user - this no longer uses full_name
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            name: email.split('@')[0], // Use part of email as initial name
            role: 'buyer' // Set role in profile too
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
          // We don't throw here since user and role are already created
        }
      } catch (e: any) {
        console.error("Error in signup process:", e);
        throw new Error(`Registration error: ${e.message}`);
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/auth/verify");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        // Log logout activity
        try {
          await supabase.from('user_activity').insert({
            user_id: user.id,
            activity_type: 'Logout',
            metadata: {
              timestamp: new Date().toISOString(),
              status: 'completed'
            }
          });
        } catch (error) {
          console.error('Error logging logout activity:', error);
        }
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUserRole(null);
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
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
