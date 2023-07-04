/**
 * Formats a number with commas separating thousands.
 * @param number - The number to format.
 * @returns The formatted number as a string.
 */
export const formatNumberWithCommas = (
  number: number,
  maximumFractionDigits = 2,
): string => {
  return number.toLocaleString('en-US', {
    maximumFractionDigits: maximumFractionDigits,
  });
};
