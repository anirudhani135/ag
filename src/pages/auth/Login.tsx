import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Get the return path from location state or default to developer dashboard
  const from = location.state?.from || "/developer/dashboard";

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      await signIn(email, password);
      navigate("/developer/dashboard"); // Redirect to developer dashboard
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.message);
      toast({
        variant: "destructive",
        title: "Login failed",
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
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below to access your account
        </p>
      </div>

      {formError && (
        <div className="p-3 my-2 text-sm border rounded-md bg-destructive/10 border-destructive/20 text-destructive">
          {formError}
        </div>
      )}

      <AuthForm
        type="signin"
        onSubmit={handleLogin}
        disabled={isLoading}
      />

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          <Link to="/auth/reset-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
