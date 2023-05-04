import * as React from 'react';
import { Keyboard } from 'react-native';
import { useSoftInputState } from 'react-native-avoid-softinput';

import { isAndroid } from '@/utils';

export const useKeyboardVisibility = () => {
  const [isKeyboardOpenGeneral, setIsKeyboardOpenGeneral] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (isAndroid()) setIsKeyboardOpenGeneral(true); // Prevent double rerender on IOS
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (isAndroid()) setIsKeyboardOpenGeneral(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const { isSoftInputShown } = useSoftInputState();

  // Use better optimised state values for each platform.
  return isAndroid() ? isKeyboardOpenGeneral : isSoftInputShown;
};
