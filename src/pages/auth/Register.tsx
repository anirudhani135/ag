
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
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
      console.log("Regular registration attempt for:", email);
      await signUp(email, password);
      navigate("/auth/verify");
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
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

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
