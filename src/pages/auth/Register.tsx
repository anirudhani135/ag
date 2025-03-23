
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

  const handleRegister = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signUp(email, password);
      // Navigation to verify email page is handled in signUp function
    } catch (error: any) {
      console.error("Registration error:", error);
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
    
    try {
      // Generate a random email with dev_ prefix
      const randomEmail = `dev_${Math.random().toString(36).substring(2, 8)}@example.com`;
      
      // Create a strong password that meets validation requirements
      const randomPassword = `Dev${Math.random().toString(36).substring(2, 8)}1`;
      
      // First register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: randomEmail,
        password: randomPassword,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Then assign developer role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'developer'
          });
        
        if (roleError) throw roleError;
        
        toast({
          title: "Developer account created",
          description: `Your developer account has been registered with email: ${randomEmail} and password: ${randomPassword}. Please save these credentials.`,
          variant: "default",
        });
        
        // Auto sign in with the new developer credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: randomEmail,
          password: randomPassword,
        });
        
        if (signInError) throw signInError;
        
        navigate("/developer/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Developer registration failed",
        description: error.message,
      });
      console.error("Developer registration error:", error);
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

      <AuthForm
        type="signup"
        onSubmit={handleRegister}
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
