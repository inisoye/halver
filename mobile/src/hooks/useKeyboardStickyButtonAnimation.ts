import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import {
  AvoidSoftInput,
  useSoftInputHidden,
  useSoftInputShown,
} from 'react-native-avoid-softinput';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { isIOS } from '@/utils';

const absoluteBottomValue = isIOS() ? 40 : 28;

export const useKeyboardStickyButtonAnimation = () => {
  const isFocused = useIsFocused();

  React.useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);

    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, [isFocused]);

  const buttonContainerPaddingHorizontalValue = useSharedValue(24);
  const buttonContainerPaddingValue = useSharedValue(0);
  const buttonContainerBottomValue = useSharedValue(absoluteBottomValue);

  const buttonBorderRadiusValue = useSharedValue(4);

  const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingHorizontal: buttonContainerPaddingHorizontalValue.value,
      paddingBottom: buttonContainerPaddingValue.value,
      bottom: buttonContainerBottomValue.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: buttonBorderRadiusValue.value,
      borderBottomLeftRadius: buttonBorderRadiusValue.value,
    };
  });

  useSoftInputShown(({ softInputHeight }) => {
    buttonContainerPaddingHorizontalValue.value = withTiming(0);
    buttonContainerPaddingValue.value = withTiming(softInputHeight);
    buttonContainerBottomValue.value = withTiming(0);
    buttonBorderRadiusValue.value = withTiming(0);
  });

  useSoftInputHidden(() => {
    buttonContainerPaddingHorizontalValue.value = withTiming(24);
    buttonContainerPaddingValue.value = withTiming(0);
    buttonContainerBottomValue.value = withTiming(absoluteBottomValue);
    buttonBorderRadiusValue.value = withTiming(4);
  });

  return {
    isFocused,
    buttonContainerAnimatedStyle,
    buttonAnimatedStyle,
  };
};
