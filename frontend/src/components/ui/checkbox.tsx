import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <input
        checked={checked}
        onClick={onCheckedChange}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
