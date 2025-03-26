
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const refreshUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      setUserRole(data?.role || null);
      console.log("User role refreshed:", data?.role);
    } catch (error) {
      console.error('Error in refreshUserRole:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user role during auth change:', error);
            setUserRole(null);
          } else {
            console.log("User role fetched:", data?.role);
            setUserRole(data?.role);
          }
          
          // Log the activity if login event
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
              console.log("Login activity logged successfully");
            } catch (activityError) {
              console.error("Error logging login activity:", activityError);
            }
          }
        } catch (roleError) {
          console.error("Error fetching role:", roleError);
          setUserRole(null);
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
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching initial user role:', error);
            setUserRole(null);
          } else {
            console.log("Initial user role fetched:", data?.role);
            setUserRole(data?.role);
          }
        } catch (roleError) {
          console.error("Error fetching initial role:", roleError);
          setUserRole(null);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    userRole,
    refreshUserRole
  };
};
