import * as React from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSoftInputState } from 'react-native-avoid-softinput';

export const useKeyboardVisibility = () => {
  const [isKeyboardOpenGeneral, setIsKeyboardOpenGeneral] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpenGeneral(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpenGeneral(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const { isSoftInputShown } = useSoftInputState();

  // Use better optimised state values for each platform.
  return Platform.OS === 'ios' ? isSoftInputShown : isKeyboardOpenGeneral;
};
