import { Appearance, Platform } from 'react-native';

/**
 * Returns true if the app is running on Android, false otherwise.
 */
export const isAndroid = (): boolean => Platform.OS === 'android';

/**
 * Returns true if the app is running on iOS, false otherwise.
 */
export const isIOS = (): boolean => Platform.OS === 'ios';

/**
 * Returns true if the app is in dark mode, false otherwise.
 */
export const isDarkMode = (): boolean => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark';
};

/**
 * Returns true if the app is in light mode, false otherwise.
 */
export const isLightMode = (): boolean => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'light';
};
