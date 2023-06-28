/**
 * Two variants of the keyboard sticky button have been created:
 * KeyboardStickyButtonProps and AbsoluteKeyboardStickyButtonProps.
 * The latter floats on the screen whilst the former does not.
 */

import {
  border,
  BoxProps,
  color,
  ColorProps,
  createBox,
  createRestyleComponent,
  createVariant,
  spacing,
  SpacingProps,
} from '@shopify/restyle';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  useAbsoluteKeyboardStickyButtonAnimation,
  useButtonAnimation,
  useKeyboardStickyButtonAnimation,
} from '@/hooks';
import { Theme } from '@/lib/restyle';

import { AnimatedBox } from './Box';

export type KeyboardStickyButtonProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  ColorProps<Theme> &
  PressableProps & {
    variant?: keyof Theme['buttonVariants'];
    areHapticsEnabled?: boolean;
  };

const buttonVariant = createVariant({ themeKey: 'buttonVariants' });

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// Create a box component with Pressable as the base component
const PressableBox = createBox<Theme>(AnimatedPressable);

export const KeyboardStickyButton = createRestyleComponent<
  KeyboardStickyButtonProps,
  Theme
>(
  // Use the buttonVariant, spacing and color Restyle functions together
  [buttonVariant, spacing, color, border],
  ({ areHapticsEnabled = true, ...props }) => {
    const {
      animatedStyle: baseAnimationStyles,
      handlePressIn: handlePressInAnimation,
      handlePressOut,
    } = useButtonAnimation({
      disabled: props.disabled,
    });

    const { buttonContainerAnimatedStyle, buttonAnimatedStyle: stickyAnimatedStyles } =
      useKeyboardStickyButtonAnimation();

    const handlePressIn = () => {
      handlePressInAnimation();

      if (areHapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };

    return (
      <AnimatedBox backgroundColor="background" style={buttonContainerAnimatedStyle}>
        <PressableBox
          {...props}
          style={[baseAnimationStyles, stickyAnimatedStyles, props.style]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </AnimatedBox>
    );
  },
);

export const AbsoluteKeyboardStickyButton = createRestyleComponent<
  KeyboardStickyButtonProps,
  Theme
>(
  // Use the buttonVariant, spacing and color Restyle functions together
  [buttonVariant, spacing, color, border],
  ({ areHapticsEnabled = true, ...props }) => {
    const {
      animatedStyle: baseAnimationStyles,
      handlePressIn: handlePressInAnimation,
      handlePressOut,
    } = useButtonAnimation({
      disabled: props.disabled,
    });

    const { buttonContainerAnimatedStyle, buttonAnimatedStyle: stickyAnimatedStyles } =
      useAbsoluteKeyboardStickyButtonAnimation();

    const handlePressIn = () => {
      handlePressInAnimation();

      if (areHapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };

    return (
      <AnimatedBox backgroundColor="background" style={buttonContainerAnimatedStyle}>
        <PressableBox
          {...props}
          alignSelf="center"
          style={[baseAnimationStyles, stickyAnimatedStyles, props.style]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </AnimatedBox>
    );
  },
);
