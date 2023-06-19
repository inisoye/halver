import {
  border,
  BoxProps,
  color,
  ColorProps,
  createBox,
  createRestyleComponent,
  spacing,
  SpacingProps,
} from '@shopify/restyle';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { useButtonAnimation } from '@/hooks';
import { Theme } from '@/lib/restyle';

export type PressableProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  ColorProps<Theme> &
  RNPressableProps & {
    areHapticsEnabled?: boolean;
    animateTranslate?: boolean;
    animateScale?: boolean;
    handlePressIn?: () => void;
    handlePressOut?: () => void;
  };

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export const Pressable = createRestyleComponent<PressableProps, Theme>(
  [spacing, color, border],
  ({
    areHapticsEnabled = true,
    animateScale = false,
    animateTranslate = true,
    disabled = false,
    handlePressIn: propHandlePressIn,
    handlePressOut: propHandlePressOut,
    ...props
  }) => {
    const {
      animatedStyle,
      handlePressIn: internalHandlePressIn,
      handlePressOut: internalHandlePressOut,
    } = useButtonAnimation({
      animateScale,
      animateTranslate,
      disabled,
    });

    const handlePressIn = () => {
      internalHandlePressIn();

      if (areHapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (propHandlePressIn) {
        propHandlePressIn();
      }
    };

    const handlePressOut = () => {
      internalHandlePressOut();

      if (propHandlePressOut) {
        propHandlePressOut();
      }
    };

    // Create a box component with Pressable as the base component
    const Box = createBox<Theme>(AnimatedPressable);

    return (
      <Box
        {...props}
        disabled={disabled}
        style={[props.style, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      />
    );
  },
);
