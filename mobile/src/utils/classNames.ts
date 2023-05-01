import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with additional classes using clsx and tailwind-merge.
 * The order of the classes is imported. Later classes override earlier ones.
 * @param inputs - One or more class values to be merged.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
