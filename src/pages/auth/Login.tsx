
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    // For development purposes, allow direct access
    toast({
      title: "Development mode",
      description: "Bypassing authentication for development. Welcome!",
      variant: "default",
    });
    navigate("/dashboard/overview");
  };

  const handleDeveloperLogin = () => {
    // For development purposes, allow direct access to developer dashboard
    toast({
      title: "Developer access granted",
      description: "Accessing developer dashboard in development mode.",
      variant: "default",
    });
    navigate("/developer/overview");
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

      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDeveloperLogin}
        >
          Developer Dashboard (Dev Mode)
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Login;
