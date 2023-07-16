import {
  BoxProps,
  createBox,
  createRestyleComponent,
  spacing,
  SpacingProps,
  visible,
  VisibleProps,
} from '@shopify/restyle';
import { TouchableOpacityProps as RNTouchableOpacityProps } from 'react-native';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';

import { Theme } from '@/lib/restyle';

export type TouchableOpacityProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  RNTouchableOpacityProps;

export const TouchableOpacity = createRestyleComponent<TouchableOpacityProps, Theme>(
  [spacing, visible],
  createBox<Theme>(RNGHTouchableOpacity),
);
