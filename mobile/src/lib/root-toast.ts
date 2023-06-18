import Toast from 'react-native-root-toast';

import { colors } from '@/theme';
import { isDarkMode, isIOS } from '@/utils';

const textVariantStyles = {
  error: {
    backgroundColor: colors['red-dark'][700],
    color: 'white',
  },
  success: {
    backgroundColor: isDarkMode()
      ? colors['green-dark'][300]
      : colors['green-light'][900],
    color: 'white',
  },
  neutral: {
    backgroundColor: isDarkMode()
      ? colors['grey-dark'][500]
      : colors['grey-light'][900],
    color: 'white',
  },
  pharlap: {
    backgroundColor: isDarkMode() ? colors.pharlap[950] : colors.pharlap[600],
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
    width: '100%',
    maxWidth: '88%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 3,
  },
};

export const showToast = (
  message: string,
  type = 'neutral' as keyof typeof textVariantStyles,
  duration?: number,
  backgroundColor?: string,
) => {
  Toast.show(message, {
    duration: duration ?? 1000,
    position: isIOS() ? -95 : -102,
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
