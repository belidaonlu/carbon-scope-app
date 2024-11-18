import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";

const variantIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  destructive: XCircle,
};

const Alert = React.forwardRef(({ 
  className, 
  variant = "info", 
  children, 
  icon,
  dismissible = false,
  onDismiss,
  ...props 
}, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const Icon = icon || variantIcons[variant];

  const variantStyles = {
    info: "border-blue-200 text-blue-800 bg-blue-50",
    success: "border-green-200 text-green-800 bg-green-50",
    warning: "border-yellow-200 text-yellow-800 bg-yellow-50",
    error: "border-red-200 text-red-800 bg-red-50",
    destructive: "border-red-200 text-red-800 bg-red-50"
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        "transition-all duration-300 ease-in-out",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        {Icon && <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />}
        <div className="flex-grow">{children}</div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Dismiss alert"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
});

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  >
    {children}
  </div>
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };