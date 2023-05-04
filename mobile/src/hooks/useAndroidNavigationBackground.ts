import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme } from 'react-native';

import { colors } from '@/theme';
import { isAndroid } from '@/utils';

export const useAndroidNavigationBackground = () => {
  const scheme = useColorScheme();

  if (isAndroid())
    NavigationBar.setBackgroundColorAsync(
      scheme === 'dark' ? colors['green-dark'][50] : colors['main-bg-light'],
    );
};
