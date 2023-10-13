import {
  BoxProps,
  createBox,
  createRestyleComponent,
  spacing,
  SpacingProps,
  visible,
  VisibleProps,
} from '@shopify/restyle';
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps as RNTouchableOpacityProps,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { Theme } from '@/lib/restyle';

export type TouchableOpacityProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  RNTouchableOpacityProps;

export const TouchableOpacity = createRestyleComponent<
  TouchableOpacityProps,
  Theme
>([spacing, visible], createBox<Theme>(RNTouchableOpacity));

export const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
