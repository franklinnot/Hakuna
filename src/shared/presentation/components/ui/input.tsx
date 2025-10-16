import React from "react";
import { mixStyle } from "../../../application/lib/mix-style";
import type { InputProps } from "../../../presentation/html.types";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={mixStyle(
          `w-full h-10 px-4 py-2 border border-gray-300 rounded-full 
          shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)]
          focus:border-transparent`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
