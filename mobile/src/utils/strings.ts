/**
 * Asserts that the input is a string.
 * Throws a TypeError if the input is not a string.
 * https://github.com/validatorjs/validator.js/blob/9ba173563c8e2ef674c7aa1b67b283ef75508a3b/src/lib/util/assertString.js
 *
 * @param input - The input to assert as a string.
 * @returns void
 * @throws TypeError
 */
export const assertString = (input: unknown): void => {
  const isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    let invalidType: string | undefined = typeof input;
    if (input === null) {
      invalidType = 'null';
    } else if (invalidType === 'object') {
      invalidType = input?.constructor.name;
    }

    throw new TypeError(`Expected a string but received a ${invalidType}`);
  }
};

/**
 * Returns whether a value is either a string or an array of strings.
 * @param value - The value to check.
 * @returns True if the value is a string or an array of strings, false otherwise.
 */
export const isStringOrArrayOfStrings = (
  value: unknown,
): value is string | string[] => {
  return (
    typeof value === 'string' ||
    (Array.isArray(value) && value.every(item => typeof item === 'string'))
  );
};

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
    (stringWithSpaces &&
      stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1)) ||
    ''
  );
};

/**
 * @param string A string in lower or upper case to be converted to title case.
 * @returns The input string formatted to title case.
 * KPONGETTE becomes Kpongette
 * https://stackoverflow.com/a/196991/15063835
 */
export const convertToTitleCase = (string: string) => {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * @param string A string (in kebab or snake case) to be converted to title case.
 * @returns The input string formatted to title case.
 * transactions__today-tomorrow becomes Transactions Today Tomorrow
 * https://stackoverflow.com/a/64489760/15063835
 */
export const convertKebabAndSnakeToTitleCase = (string: string | undefined) => {
  if (!string) {
    return '';
  }

  // Remove hyphens and underscores
  const formattedString = string
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());

  return convertToTitleCase(formattedString);
};

/**
 * @param string A user's (full, first or last) name.
 * @returns The intials of the user.
 */
export const getInitials = (string: string | undefined) => {
  if (!string) {
    return '';
  }

  const names = string.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }

  return initials;
};

/**
 * Removes all spaces (trailing, leading, and in-between) from a string.
 * @param string - The input string.
 * @returns The string without any spaces.
 */
export function removeSpaces(string: string): string {
  if (!string) {
    return '';
  }

  return string.replace(/\s/g, '');
}
