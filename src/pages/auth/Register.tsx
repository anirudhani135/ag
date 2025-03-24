
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async (email: string, password: string) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      await signUp(email, password);
      // Navigation to verify email page is handled in signUp function
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeveloperRegister = async () => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Generate a random email with dev_ prefix
      const randomEmail = `dev_${Math.random().toString(36).substring(2, 10)}@example.com`;
      
      // Create a strong password that meets validation requirements
      const randomPassword = `Dev${Math.random().toString(36).substring(2, 8)}!1Ab`;
      
      // First register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: randomEmail,
        password: randomPassword,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        console.log("Developer user created:", authData.user.id);
        
        // Then assign developer role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'developer'
          });
        
        if (roleError) {
          console.error("Role assignment error:", roleError);
          throw roleError;
        }
        
        console.log("Developer role assigned successfully");
        
        // Create a profile for the developer - fixed to use name, not full_name
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: randomEmail,
            name: `Developer ${randomEmail.split('@')[0].substring(4)}`,
            role: 'developer'
          });
          
        if (profileError) {
          console.error("Error creating developer profile:", profileError);
          // Don't throw here as we've already created the user and role
        } else {
          console.log("Developer profile created successfully");
        }
        
        toast({
          title: "Developer account created",
          description: `Your developer account has been registered with email: ${randomEmail} and password: ${randomPassword}. Please save these credentials.`,
          variant: "default",
          duration: 10000, // Longer duration to ensure user sees credentials
        });
        
        // Auto sign in with the new developer credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: randomEmail,
          password: randomPassword,
        });
        
        if (signInError) {
          console.error("Developer auto sign-in error:", signInError);
          throw signInError;
        }
        
        navigate("/developer/dashboard");
      } else {
        throw new Error("Failed to create developer account");
      }
    } catch (error: any) {
      console.error("Developer registration error:", error);
      setFormError(error.message);
      toast({
        variant: "destructive",
        title: "Developer registration failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your information below to create your account
        </p>
      </div>

      {formError && (
        <div className="p-3 my-2 text-sm border rounded-md bg-destructive/10 border-destructive/20 text-destructive">
          {formError}
        </div>
      )}

      <AuthForm
        type="signup"
        onSubmit={handleRegister}
        disabled={isLoading}
      />

      <div className="mt-4 space-y-2">
        <Button
          variant="outline"
          className="w-full bg-white text-black border-gray-200 hover:bg-gray-50"
          onClick={handleDeveloperRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Register as Developer"
          )}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
