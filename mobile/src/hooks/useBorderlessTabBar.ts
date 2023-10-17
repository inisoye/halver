import { useTheme } from '@shopify/restyle';
import * as React from 'react';

import { Theme } from '@/lib/restyle';
import { isIOS } from '@/utils';

export const useBorderlessTabBar = (navigation, showBorder = false) => {
  const { colors } = useTheme<Theme>();

  React.useEffect(() => {
    if (showBorder) {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          borderTopColor: colors.bottomTabBorder,
          flex: isIOS() ? 0.07 : 0.08,
          elevation: 0,
          backgroundColor: colors.bottomTabBackground,
        },
      });
    } else {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          borderTopColor: 'transparent',
          flex: isIOS() ? 0.07 : 0.08,
          elevation: 0,
          backgroundColor: colors.bottomTabBackground,
        },
      });
    }

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          borderTopColor: colors.bottomTabBorder,
          flex: isIOS() ? 0.07 : 0.08,
          elevation: 0,
          backgroundColor: colors.bottomTabBackground,
        },
      });
    };
  }, [
    colors.bottomTabBackground,
    showBorder,
    colors.bottomTabBorder,
    navigation,
  ]);
};
