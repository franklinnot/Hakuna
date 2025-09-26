import React from "react";
import { mixStyle } from "../../../application/lib/mix-style";
import type { InputProps } from "../../../application/types/html.types";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={mixStyle(
          `w-full h-10 px-3 py-2 border border-gray-300 rounded-md 
          shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-transparent`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
