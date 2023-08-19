import { Appearance, Platform, useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { allMMKVKeys } from '@/lib/mmkv';

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

export const useIsDarkModeSelected = () => {
  const [displayMode = 'dark'] = useMMKVString(allMMKVKeys.displayMode);

  const colorScheme = useColorScheme();
  const isSystemDarkMode = displayMode === 'system' && colorScheme === 'dark';

  if (displayMode === 'dark' || isSystemDarkMode) {
    return true;
  } else {
    return false;
  }
};

export const IS_DEV_OR_PREVIEW =
  process.env.EXPO_PUBLIC_APP_VARIANT === 'development' ||
  process.env.EXPO_PUBLIC_APP_VARIANT === 'preview';
export const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === 'development';
