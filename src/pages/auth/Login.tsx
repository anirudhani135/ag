
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <AuthForm type="signin" />

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
