import React from "react";
import { mixStyle } from "../../../application/lib/mix-style";
import type { ButtonProps } from "../../../application/types/html.types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={mixStyle(
          `w-full h-10 px-4 py-2 rounded-md font-semibold text-white 
          bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
          focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400`,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

