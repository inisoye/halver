import { Platform } from 'react-native';
import Toast from 'react-native-root-toast';

import { colors } from '@/theme';

const textVariantStyles = {
  error: {
    backgroundColor: colors['red-light'][950],
    color: 'white',
  },
  success: {
    backgroundColor: 'green',
    color: 'white',
  },
  neutral: {
    backgroundColor: 'gray',
    color: 'white',
  },
};

const styles = {
  text: {
    fontFamily: 'Halver-Medium',
  },
  container: {
    width: '88%',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
};

export const showToast = (message: string, type: keyof typeof textVariantStyles) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Platform.OS === 'ios' ? -55 : -30,
    shadow: false,
    animation: true,
    opacity: 1,
    hideOnPress: true,
    delay: 0,
    backgroundColor: textVariantStyles[type].backgroundColor,
    textColor: textVariantStyles[type].color,
    textStyle: styles.text,
    containerStyle: styles.container,
  });
};
