
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = () => {
    toast({
      title: "Registration Successful",
      description: "Your account has been created successfully!",
    });
    
    // Redirect to the dashboard
    setTimeout(() => {
      navigate("/user/dashboard");
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Sign up to get started with AgentVerse
        </p>
      </div>

      <AuthForm type="signup" />

      <div className="mt-4 text-center">
        <Button 
          onClick={handleSignUp} 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Sign Up (Development Mode)
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
