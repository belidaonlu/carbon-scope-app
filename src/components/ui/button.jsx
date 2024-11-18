import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

const Button = React.forwardRef(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    asChild = false,
    loading = false,
    icon,
    iconPosition = "left",
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";

    const content = (
      <>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95": variant === "destructive",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/85": variant === "secondary",
            "hover:bg-accent hover:text-accent-foreground active:bg-accent/90": variant === "ghost",
            "hover:bg-accent hover:text-accent-foreground underline-offset-4": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "cursor-not-allowed opacity-50": loading || disabled
          },
          className
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };