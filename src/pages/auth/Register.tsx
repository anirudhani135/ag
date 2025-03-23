
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeveloperRegister = async () => {
    setIsLoading(true);
    try {
      // First register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `dev_${Math.random().toString(36).substring(2, 8)}@example.com`,
        password: "Password123",
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
          description: "Your developer account has been registered. Please check your email to verify.",
          variant: "default",
        });
        
        navigate("/auth/verify");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
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
          Register as Developer
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
