import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error, 
  icon,
  clearable = false,
  maxLength,
  onClear,
  ...props 
}, ref) => {
  const [showClear, setShowClear] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (props.value && clearable) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [props.value, clearable]);

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const mergedRef = (node) => {
    // Handle both refs
    inputRef.current = node;
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          icon && "pl-10",
          showClear && "pr-10",
          className
        )}
        ref={mergedRef}
        maxLength={maxLength}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {maxLength && props.value && (
        <div className="absolute right-3 bottom-1 text-xs text-gray-400">
          {props.value.length}/{maxLength}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };