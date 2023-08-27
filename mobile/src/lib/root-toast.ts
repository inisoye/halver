import type { DimensionValue } from 'react-native';
import Toast from 'react-native-root-toast';

import { isDarkMode, isIOS } from '@/utils';

import { brandColors, darkColors, lightColors } from './restyle';

const textVariantStyles = {
  error: {
    backgroundColor: isDarkMode() ? darkColors.red7 : darkColors.red8,
    color: 'white',
  },
  success: {
    backgroundColor: isDarkMode() ? darkColors.green4 : lightColors.green10,
    color: 'white',
  },
  neutral: {
    backgroundColor: isDarkMode() ? darkColors.gray6 : lightColors.gray10,
    color: 'white',
  },
  pharlap: {
    backgroundColor: isDarkMode() ? brandColors.pharlap11 : brandColors.pharlap7,
    color: 'white',
  },
};

const styles = {
  text: {
    fontFamily: 'Halver-Medium',
    fontSize: 14,
    textAlign: 'left' as const,
  },
  container: {
    width: '100%' as DimensionValue,
    maxWidth: '88%' as DimensionValue,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 3,
  },
};

export const showToast = (
  message: string,
  type = 'neutral' as keyof typeof textVariantStyles,
  duration = 1000,
  backgroundColor?: string,
  position?: number,
) => {
  Toast.show(message, {
    duration: duration,
    position: position ?? isIOS() ? -95 : -102,
    shadow: false,
    animation: true,
    opacity: 1,
    hideOnPress: true,
    delay: 0,
    backgroundColor: backgroundColor ?? textVariantStyles[type].backgroundColor,
    textColor: textVariantStyles[type].color,
    textStyle: styles.text,
    containerStyle: styles.container,
  });
};
