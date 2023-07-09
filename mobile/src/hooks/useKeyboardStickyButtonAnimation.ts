import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import {
  AvoidSoftInput,
  useSoftInputHidden,
  useSoftInputShown,
} from 'react-native-avoid-softinput';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { isIOS } from '@/utils';

const absoluteBottomValue = isIOS() ? 40 : 28;

const horizontalPadding = 24;

export const useKeyboardStickyButtonAnimation = () => {
  const isFocused = useIsFocused();

  React.useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);

    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, [isFocused]);

  const buttonContainerPaddingHorizontalValue = useSharedValue(horizontalPadding);
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
    buttonContainerPaddingHorizontalValue.value = withTiming(horizontalPadding);
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

export const useKeyboardStickyButtonWithPrefixAnimation = () => {
  const isFocused = useIsFocused();

  React.useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);

    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, [isFocused]);

  const buttonContainerPaddingHorizontalValue = useSharedValue(horizontalPadding);
  const buttonContainerPaddingValue = useSharedValue(0);
  const buttonContainerBottomValue = useSharedValue(absoluteBottomValue);
  const buttonsGapValue = useSharedValue(8);

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
      marginLeft: buttonsGapValue.value,
    };
  });

  const prefixButtonAnimatedStyle = useAnimatedStyle(() => {
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

    buttonsGapValue.value = withTiming(0);
  });

  useSoftInputHidden(() => {
    buttonContainerPaddingHorizontalValue.value = withTiming(horizontalPadding);
    buttonContainerPaddingValue.value = withTiming(0);
    buttonContainerBottomValue.value = withTiming(absoluteBottomValue);
    buttonBorderRadiusValue.value = withTiming(4);

    buttonsGapValue.value = withTiming(8);
  });

  return {
    isFocused,
    buttonContainerAnimatedStyle,
    buttonAnimatedStyle,
    prefixButtonAnimatedStyle,
  };
};

export const useAbsoluteKeyboardStickyButtonAnimation = () => {
  const isFocused = useIsFocused();

  const { width } = useWindowDimensions();
  const widthExcludingPadding = width - horizontalPadding * 2;

  React.useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);

    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, [isFocused]);

  const buttonContainerPaddingHorizontalValue = useSharedValue(horizontalPadding);
  const buttonBottomValue = useSharedValue(absoluteBottomValue);
  const buttonBorderRadiusValue = useSharedValue(4);
  const buttonWidthValue = useSharedValue(widthExcludingPadding);

  const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingHorizontal: buttonContainerPaddingHorizontalValue.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: buttonBorderRadiusValue.value,
      borderBottomLeftRadius: buttonBorderRadiusValue.value,
      bottom: buttonBottomValue.value,
      width: buttonWidthValue.value,
    };
  });

  useSoftInputShown(({ softInputHeight }) => {
    buttonContainerPaddingHorizontalValue.value = withTiming(0);
    buttonBottomValue.value = withTiming(softInputHeight);
    buttonBorderRadiusValue.value = withTiming(0);
    buttonWidthValue.value = withTiming(width);
  });

  useSoftInputHidden(() => {
    buttonContainerPaddingHorizontalValue.value = withTiming(horizontalPadding);
    buttonBottomValue.value = withTiming(absoluteBottomValue);
    buttonBorderRadiusValue.value = withTiming(4);
    buttonWidthValue.value = withTiming(widthExcludingPadding);
  });

  return {
    isFocused,
    buttonAnimatedStyle,
    buttonContainerAnimatedStyle,
  };
};
