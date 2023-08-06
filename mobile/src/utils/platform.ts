import { Appearance, Platform, useColorScheme } from 'react-native';

export const isAndroid = (): boolean => Platform.OS === 'android';

export const isIOS = (): boolean => Platform.OS === 'ios';

export const isWeb = (): boolean => Platform.OS === 'web';

export const isDarkMode = (): boolean => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark';
};

export const isLightMode = (): boolean => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'light';
};

export const useIsDarkMode = (): boolean => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark';
};

export const useIsLightMode = (): boolean => {
  const colorScheme = useColorScheme();
  return colorScheme === 'light';
};

export const IS_DEV_OR_PREVIEW =
  process.env.EXPO_PUBLIC_APP_VARIANT === 'development' ||
  process.env.EXPO_PUBLIC_APP_VARIANT === 'preview';
export const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === 'development';
