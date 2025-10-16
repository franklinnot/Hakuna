import React from 'react';
import { mixStyle } from '../../../application/lib/mix-style';
import type { ButtonProps } from '../../../presentation/html.types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={mixStyle(
          `w-full h-10 px-4 py-3 rounded-full font-semibold bg-[var(--green-primary)]
          hover:bg-[var(--green-secondary)] focus:outline-[var(--green-primary)]
          focus:outline-offset-2  disabled:bg-gray-400 focus:outline-2 cursor-pointer 
          min-w-max text-white transition-colors duration-75 disabled:cursor-not-allowed`,
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
