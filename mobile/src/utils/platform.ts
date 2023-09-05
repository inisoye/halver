import { Appearance, Platform, useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { allMMKVKeys, storage } from '@/lib/mmkv';

export const isAndroid = (): boolean => Platform.OS === 'android';

export const isIOS = (): boolean => Platform.OS === 'ios';

export const isWeb = (): boolean => Platform.OS === 'web';

export const isDarkMode = (): boolean => {
  const displayMode = storage.getString(allMMKVKeys.displayMode);

  const colorScheme = Appearance.getColorScheme();
  const isSystemDarkMode = displayMode === 'system' && colorScheme === 'dark';

  return displayMode === 'dark' || isSystemDarkMode;
};

export const useIsDarkModeSelected = () => {
  const [displayMode = 'system'] = useMMKVString(allMMKVKeys.displayMode);

  const colorScheme = useColorScheme();
  const isSystemDarkMode = displayMode === 'system' && colorScheme === 'dark';

  return displayMode === 'dark' || isSystemDarkMode;
};
