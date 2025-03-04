
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = (email: string, password: string) => {
    // For development purposes, simulate successful registration
    toast({
      title: "Account created",
      description: "You have successfully registered in development mode.",
      variant: "default",
    });
    navigate("/dashboard/overview");
  };

  const handleDeveloperRegister = () => {
    // For development purposes, allow direct access to developer dashboard
    toast({
      title: "Developer account created",
      description: "Accessing developer dashboard in development mode.",
      variant: "default",
    });
    navigate("/developer/overview");
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

      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDeveloperRegister}
        >
          Register as Developer (Dev Mode)
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Register;
