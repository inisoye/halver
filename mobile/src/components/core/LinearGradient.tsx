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
  LinearGradient as ExpoLinearGradient,
  LinearGradientProps as ExpoLinearGradientProps,
} from 'expo-linear-gradient';

import { Theme } from '@/lib/restyle';

export type LinearGradientProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  ExpoLinearGradientProps;

export const LinearGradient = createRestyleComponent<LinearGradientProps, Theme>(
  [spacing, visible],
  createBox<Theme>(ExpoLinearGradient),
);
