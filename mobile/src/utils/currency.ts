/**
 * Converts a number to Nigerian Naira currency format.
 *
 * @param amount - The number to be converted.
 * @returns The converted amount in Nigerian Naira currency format.
 */
export const convertNumberToNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};
