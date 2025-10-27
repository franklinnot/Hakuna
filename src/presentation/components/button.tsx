import React from 'react';
import { mixStyle } from '../../application/lib/mix-style';
import type { ButtonProps } from '../html.types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        {...props}
        className={mixStyle(
          `w-full h-10 px-4 py-3 rounded-full font-semibold
          min-w-max text-white transition-colors duration-75
          bg-[var(--green-primary)] hover:bg-[var(--green-secondary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)]
          ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer'}`,
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
