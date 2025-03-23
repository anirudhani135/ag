
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get the return path from location state or default to dashboard
  const from = location.state?.from || "/user/dashboard";

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      // Navigation handled in signIn function based on user role
    } catch (error) {
      console.error("Login error:", error);
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

      <AuthForm
        type="signin"
        onSubmit={handleLogin}
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
