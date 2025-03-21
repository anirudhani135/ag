
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 hover:shadow-md shadow-sm",
        destructive: "bg-destructive text-white hover:bg-destructive/90 hover:shadow-md shadow-sm",
        outline: "border-2 border-input bg-background hover:bg-accent/10 hover:text-accent hover:shadow-md shadow-sm",
        secondary: "bg-secondary text-white hover:bg-secondary/80 hover:shadow-md shadow-sm",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-md shadow-sm",
        primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200/50 shadow-sm hover:scale-[1.02]",
        success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200/50 shadow-sm hover:scale-[1.02]", 
        warning: "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-amber-200/50 shadow-sm",
        info: "bg-sky-500 text-white hover:bg-sky-600 hover:shadow-sky-200/50 shadow-sm",
        action: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200/50 shadow-sm hover:scale-[1.02]",
        save: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200/50 shadow-sm hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-md px-10 text-base",
        xxl: "h-14 rounded-md px-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
