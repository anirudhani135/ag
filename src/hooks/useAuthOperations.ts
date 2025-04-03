import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log("Attempting to sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Sign-in successful:", data.user?.id);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      // Redirect to developer dashboard instead of user dashboard
      navigate("/developer/dashboard");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Step 1: Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Auth signup error:", error);
        throw error;
      }
      
      if (!data.user) {
        console.error("No user data returned from signup");
        throw new Error("Failed to create user account");
      }
      
      console.log("User registered successfully:", data.user.id);
      
      try {
        // Step 2: Assign buyer role
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
        
        console.log("Buyer role assigned successfully");
        
        // Step 3: Create profile record
        // Inspect the profiles table schema
        const { data: profilesSchema, error: schemaError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
          
        if (schemaError) {
          console.error("Error fetching profiles schema:", schemaError);
        } else {
          console.log("Profiles table schema:", profilesSchema);
        }
        
        // Step 4: Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            name: email.split('@')[0],
            role: 'buyer'
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
          throw profileError;
        }
        
        console.log("Profile created successfully");
        
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
        
        navigate("/auth/verify");
      } catch (dbError: any) {
        console.error("Database error during signup:", dbError);
        
        // Try to clean up the auth user if possible
        try {
          console.log("Attempting to clean up failed registration");
          // Note: This requires admin rights and may not work client-side
        } catch (cleanupError) {
          console.error("Error during cleanup:", cleanupError);
        }
        
        toast({
          variant: "destructive",
          title: "Registration error",
          description: dbError.message || "Failed to complete registration",
        });
        throw dbError;
      }
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Get current user ID before signing out
      const { data: { user } } = await supabase.auth.getUser();
      
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
          console.log("Logout activity logged successfully");
        } catch (activityError) {
          console.error("Error logging logout activity:", activityError);
        }
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Sign-out error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    signUp,
    signOut
  };
};
