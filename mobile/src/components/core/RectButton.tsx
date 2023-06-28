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
  RectButton as RNGHRectButton,
  RectButtonProps as RNGHRectButtonProps,
} from 'react-native-gesture-handler';

import { Theme } from '@/lib/restyle';

export type RectButtonProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  RNGHRectButtonProps;

export const RectButton = createRestyleComponent<RectButtonProps, Theme>(
  [spacing, visible],
  createBox<Theme>(RNGHRectButton),
);
