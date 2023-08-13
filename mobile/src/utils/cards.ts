/**
 * Generates an array of formatted strings representing a debit card number.
 * @param {string} first6 - The first 6 digits of the debit card.
 * @param {string} last4 - The last 4 digits of the debit card.
 * @param {string} [placeholder=•] - A custom placeholder character. Default is '•'.
 * @returns {string[]} An array of formatted strings.
 * @example
 * const cardArray = generateRedactedCardDigits('123456', '7890');
 * // returns: ['1234', '56••', '••••', '7890']
 */
export const generateRedactedCardDigits = (
  first6: string,
  last4: string,
  placeholder = '•',
): string[] => {
  const formats: (string | string[])[] = [
    `${first6.substring(0, 4)}`,
    `${first6.substring(4, 6)}${placeholder}${placeholder}`,
    [placeholder, placeholder, placeholder, placeholder],
    `${last4.substring(0, 4)}`,
  ];

  return formats.map(format => {
    if (Array.isArray(format)) {
      return format.join('');
    }
    return format;
  });
};
