
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  showBrand?: boolean;
}

const AuthLayout = ({ children, showBrand = true }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {showBrand && (
        <div className="hidden lg:flex lg:w-1/2 bg-primary-gradient p-12 items-center justify-center">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-6">
              Transform Your Business with AI Agents
            </h1>
            <p className="text-white/80 text-lg">
              Join thousands of businesses leveraging AI to automate, innovate, and grow with our marketplace of specialized AI agents.
            </p>
          </div>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
