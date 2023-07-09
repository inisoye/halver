import { murmur3 } from 'murmurhash-js';

/**
 * Converts a string into a number representing a hue and saturation values in HSL color space.
 * The generated number is within the range of 1 to 360.
 * @param string - The string to convert.
 * @returns A number representing the hue value in HSL color space.
 */
export function convertStringToHueAndSaturation(string: string) {
  const seed = 621; // Seed value for MurmurHash3
  const hashValue = murmur3(string, seed);
  const hue = (Math.abs(hashValue) % 360) + 1;
  const saturation = (Math.abs(hashValue) % 86) + 35;
  return { hue, saturation };
}

/**
 * Generates a random HSL color.
 * @returns {string} The randomly generated color in HSL format.
 */
export function getRandomLightColor(): string {
  return `hsl(${Math.random() * 360}, 100%, 85%)`;
}

/**
 * Generates a random HSL color.
 * @returns {string} The randomly generated color in HSL format.
 */
export function getRandomDarkColor(): string {
  return `hsl(${Math.random() * 360}, 100%, 40%)`;
}

/**
 * Generates a light HSL color based on string.
 * @param string - The string used to generate the color.
 * @returns The randomly generated light color in HSL format.
 */
export function getLightColorFromString(string: string | undefined) {
  if (!string) {
    return '';
  }

  const { hue, saturation } = convertStringToHueAndSaturation(string);
  return `hsl(${hue}, ${saturation}%, 85%)`;
}

export function getLightColorWithBackgroundFromString(string: string) {
  const { hue, saturation } = convertStringToHueAndSaturation(string);
  return {
    color: `hsl(${hue}, ${saturation}%, 85%)`,
    backgroundColor: `hsl(${hue}, ${saturation}%, 5%)`,
  };
}

/**
 * Generates a dark HSL color based on string.
 * @param string - The string used to generate the color.
 * @returns The randomly generated light color in HSL format.
 */
export function getDarkColorFromString(string: string | undefined) {
  if (!string) {
    return '';
  }

  const { hue, saturation } = convertStringToHueAndSaturation(string);
  return `hsl(${hue}, ${saturation}%, 25%)`;
}

export function getDarkColorWithBackgroundFromString(string: string) {
  const { hue, saturation } = convertStringToHueAndSaturation(string);
  return {
    color: `hsl(${hue}, ${saturation}%, 25%)`,
    backgroundColor: `hsl(${hue}, ${saturation}%, 95%)`,
  };
}
