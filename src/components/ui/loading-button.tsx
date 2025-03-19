
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

export interface LoadingButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  asChild?: boolean;
  loadingIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    isLoading = false, 
    loadingText,
    children,
    icon,
    loadingIcon,
    onClick,
    ...props 
  }, ref) => {
    const [internalLoading, setInternalLoading] = React.useState(false);
    
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        setInternalLoading(true);
        try {
          await onClick(e);
        } catch (error) {
          console.error("Button click error:", error);
        } finally {
          setInternalLoading(false);
        }
      }
    };
    
    const isButtonLoading = isLoading || internalLoading;
    
    return (
      <Button
        className={cn(className)}
        variant={variant}
        size={size}
        ref={ref}
        disabled={isButtonLoading || props.disabled}
        onClick={onClick ? handleClick : undefined}
        {...props}
      >
        {isButtonLoading ? (
          <>
            {loadingIcon || <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
