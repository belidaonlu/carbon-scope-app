import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef(({ className, error, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      error && "text-red-500",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
));

Label.displayName = "Label";

export { Label };