import { useIsFocused } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Pressable, Text } from 'react-native';
import {
  AvoidSoftInput,
  useSoftInputHidden,
  useSoftInputShown,
} from 'react-native-avoid-softinput';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useButtonAnimation } from '@/hooks';
import { cn, isIOS } from '@/utils';

import {
  buttonColors,
  ButtonProps,
  buttonSizes,
  buttonTextColors,
  buttonTextSizes,
} from './Button';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type KeyboardStickyButtonProps = ButtonProps;

const absoluteBottomValue = isIOS() ? 40 : 28;

export const KeyboardStickyButton: React.FunctionComponent<
  KeyboardStickyButtonProps
> = ({
  children,
  color = 'casal',
  disabled = false,
  isHapticsEnabled = true,
  isTextContentOnly = true,
  onPress,
  pressableClassName,
  size = 'default',
  textClassName = 'default',
}) => {
  const isFocused = useIsFocused();

  React.useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);

    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, [isFocused]);

  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation({
    disabled,
  });

  const buttonContainerPaddingHorizontalValue = useSharedValue(12);
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
    };
  });

  useSoftInputShown(({ softInputHeight }) => {
    buttonContainerPaddingHorizontalValue.value = withTiming(0);
    buttonContainerPaddingValue.value = withTiming(softInputHeight);
    buttonContainerBottomValue.value = withTiming(0);
    buttonBorderRadiusValue.value = withTiming(0);
  });

  useSoftInputHidden(() => {
    buttonContainerPaddingHorizontalValue.value = withTiming(12);
    buttonContainerPaddingValue.value = withTiming(0);
    buttonContainerBottomValue.value = withTiming(absoluteBottomValue);
    buttonBorderRadiusValue.value = withTiming(4);
  });

  const handlePress = () => {
    onPress();

    if (isHapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Animated.View
      className="bg-main-bg-light dark:bg-grey-dark-50"
      style={buttonContainerAnimatedStyle}
    >
      <AnimatedPressable
        className={cn(
          pressableClassName,
          buttonSizes.default,
          buttonSizes[size],
          buttonColors[color],
        )}
        disabled={disabled}
        style={[animatedStyle, buttonAnimatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {isTextContentOnly ? (
          <Text
            className={cn(
              buttonTextSizes.default,
              buttonTextSizes[size],
              buttonTextColors[color],
              textClassName,
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};
