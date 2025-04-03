
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-2 text-center"
      >
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below to access your account
        </p>
      </motion.div>

      {formError && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 my-2 text-sm border rounded-md bg-destructive/10 border-destructive/20 text-destructive"
        >
          {formError}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AuthForm
          type="signin"
          onSubmit={handleLogin}
          disabled={isLoading}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            Register
          </Link>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          <Link to="/auth/reset-password" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            Forgot your password?
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
