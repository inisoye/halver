import {
  BoxProps,
  color,
  ColorProps,
  createBox,
  createRestyleComponent,
  createText,
  spacing,
  SpacingProps,
  TextProps,
  typography,
  TypographyProps,
  visible,
  VisibleProps,
} from '@shopify/restyle';
import { TextProps as RNTextProps } from 'react-native';

import { Theme } from '@/lib/restyle';

export const Text = createText<Theme>();

export type DynamicTextProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  TypographyProps<Theme> &
  ColorProps<Theme> &
  TextProps<Theme> &
  RNTextProps;

/**
 * The dynamic text component has been created to accept props the default Restyle text doesnt.
 */
export const DynamicText = createRestyleComponent<DynamicTextProps, Theme>(
  [spacing, visible, typography, color],
  createBox<Theme>(Text),
);
