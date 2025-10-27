import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { mixStyle } from "../../../application/lib/mix-style";

export interface SpanErrorProps {
  error: string;
  className?: string;
}

export const SpanError = ({ error, className }: SpanErrorProps) => {
  return (
    <div
      className={mixStyle(
        `flex items-center gap-2 rounded-lg bg-red-50 
        p-3 text-sm text-red-600`,
        className
      )}
    >
      <ExclamationCircleIcon className="h-5 w-5" />
      <span>{error}</span>
    </div>
  );
};
