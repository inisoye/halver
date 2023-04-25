/**
 * @param string Any camelCase or PascalCase string.
 * @returns A string with separated words PascalCase becomes Pascal Case, HODBank becomes HOD Bank etc.
 */
export const insertSpacesBeforeCapitalLetters = (string: string) => {
  string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
  string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  return string;
};

/**
 * @param string A string, usually completely in lowercase.
 * @returns The argument string with its first letter capitalized.
 */
export const capitalizeFirstLetter = (string: string) => {
  const stringWithSpaces = insertSpacesBeforeCapitalLetters(string.toLowerCase());

  return (
    (stringWithSpaces && stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1)) || ''
  );
};
