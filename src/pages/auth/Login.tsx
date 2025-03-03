
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = () => {
    toast({
      title: "Login Successful",
      description: "Welcome back! You've been signed in successfully.",
      variant: "success",
    });
    
    // Redirect to the dashboard
    setTimeout(() => {
      navigate("/user/dashboard");
    }, 1000);
  };

  const handleDevSignIn = () => {
    toast({
      title: "Developer Login",
      description: "Logged in as a developer (development mode)",
      variant: "success",
    });
    
    // Redirect to developer dashboard
    setTimeout(() => {
      navigate("/developer/dashboard");
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <AuthForm type="signin" />

      <div className="mt-4 space-y-3">
        <Button 
          onClick={handleSignIn} 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In as User
        </Button>
        
        <Button 
          onClick={handleDevSignIn} 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In as Developer
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
        <Link
          to="/auth/reset-password"
          className="text-sm font-medium text-primary hover:underline mt-2 inline-block"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
