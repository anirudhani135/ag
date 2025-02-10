
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";

const VerifyEmail = () => {
  const { toast } = useToast();

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Check your email</h2>
        <p className="text-muted-foreground mb-6">
          We've sent you a verification link. Please check your email and follow the
          instructions to verify your account.
        </p>
        <Link
          to="/auth/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
