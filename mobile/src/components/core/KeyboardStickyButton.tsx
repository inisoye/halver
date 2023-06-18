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

import { useButtonAnimation, useKeyboardStickyButtonAnimation } from '@/hooks';
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

// Create a Restyle component with useButtonAnimation hook
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
