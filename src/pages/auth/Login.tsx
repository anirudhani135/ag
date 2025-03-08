
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
    navigate("/user/dashboard");
  };

  const handleDeveloperLogin = () => {
    // For development purposes, allow direct access to developer dashboard
    toast({
      title: "Developer access granted",
      description: "Accessing developer dashboard in development mode.",
      variant: "default",
    });
    navigate("/developer/dashboard");
  };

  const handleAgentCreationAccess = () => {
    // For development purposes, allow direct access to agent creation
    toast({
      title: "Agent Creation Access",
      description: "Accessing agent creation page in development mode.",
      variant: "default",
    });
    navigate("/developer/agents/create");
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

      <div className="mt-4 space-y-2">
        <Button
          variant="outline"
          className="w-full bg-white text-black border-gray-200 hover:bg-gray-50"
          onClick={handleDeveloperLogin}
        >
          Developer Dashboard (Dev Mode)
        </Button>
        
        <Button
          variant="outline"
          className="w-full bg-black text-white hover:bg-black/90"
          onClick={handleAgentCreationAccess}
        >
          Agent Creation (Dev Mode)
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Login;
