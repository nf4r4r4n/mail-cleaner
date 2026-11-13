import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent",
          "disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Checkbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900",
          "accent-accent focus:ring-2 focus:ring-accent focus:ring-offset-0",
          "disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
