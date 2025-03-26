
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserRole, logUserActivity } from "@/utils/authUtils";

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      
      console.log("Starting sign up process for email:", email);
      
      // Step 1: Register the user with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Auth signup error:", error);
        throw error;
      }
      
      // Step 2: Check if user was created successfully
      if (!data.user) {
        console.error("No user data returned from signup");
        throw new Error("Failed to create user account");
      }
      
      console.log("User created successfully:", data.user.id);
      
      // Step 3: Assign buyer role to new user
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
        
        console.log("Buyer role assigned successfully");
        
        // Step 4: Create a profile entry for the user - Match actual DB schema
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
          throw profileError; // Throw error since profile creation is critical
        } else {
          console.log("Profile created successfully");
        }
      } catch (e: any) {
        console.error("Error in signup process:", e);
        
        // Attempt to clean up the partially created user if possible
        try {
          // This is an admin-only operation that might not work with client-side API
          // Just logging the attempt for now
          console.log("Attempting to clean up incomplete user registration");
        } catch (cleanupError) {
          console.error("Error during cleanup:", cleanupError);
        }
        
        toast({
          variant: "destructive",
          title: "Registration error",
          description: e.message,
        });
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

  const signOut = async (userId: string | undefined) => {
    try {
      setIsLoading(true);
      
      if (userId) {
        // Log logout activity
        await logUserActivity(userId, 'Logout');
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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

  return {
    isLoading,
    signIn,
    signUp,
    signOut
  };
};
