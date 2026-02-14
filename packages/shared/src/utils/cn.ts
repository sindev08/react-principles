import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and resolves Tailwind CSS conflicts
 * with tailwind-merge. Accepts the same arguments as clsx.
 *
 * @example
 * cn("px-2 py-1", "px-4") // => "px-4 py-1"
 * cn("text-red-500", condition && "text-blue-500")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
