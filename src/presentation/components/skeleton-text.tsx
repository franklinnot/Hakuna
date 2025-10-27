import { mixStyle } from "../../application/lib/mix-style";
interface SkeletonTextProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const SkeletonText = ({
  width = '100%',
  height = 16,
  className = '',
}: SkeletonTextProps) => (
  <div
    className={mixStyle(`animate-pulse bg-gray-300 rounded`, className)}
    style={{ width, height }}
  />
);
