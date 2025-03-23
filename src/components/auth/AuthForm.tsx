
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; 

// Simplified password schema with better error messages
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must contain at least one number"
  );

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
});

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit?: (email: string, password: string) => void;
  disabled?: boolean;
}

const AuthForm = ({ type, onSubmit, disabled = false }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof authSchema>) => {
    try {
      setIsLoading(true);
      if (onSubmit) {
        // Use the provided onSubmit function if available
        await onSubmit(values.email, values.password);
      } else {
        // Use actual auth functions if no custom onSubmit is provided
        if (type === "signin") {
          await signIn(values.email, values.password);
        } else {
          await signUp(values.email, values.password);
        }
      }
    } catch (error) {
      // Error is handled in the auth context
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete={type === "signin" ? "username" : "email"}
                  {...field}
                  disabled={isLoading || disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={type === "signup" ? "Create a strong password" : "Enter your password"}
                    autoComplete={type === "signin" ? "current-password" : "new-password"}
                    {...field}
                    disabled={isLoading || disabled}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                    disabled={isLoading || disabled}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              {type === "signup" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                </p>
              )}
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-sm" 
          disabled={isLoading || disabled}
        >
          {(isLoading || disabled) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {type === "signin" ? "Sign In" : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
