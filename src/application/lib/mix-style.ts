import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function mixStyle(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
