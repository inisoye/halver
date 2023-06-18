import {
  BoxProps,
  color,
  ColorProps,
  createBox,
  createRestyleComponent,
  spacing,
  SpacingProps,
  typography,
  TypographyProps,
  visible,
  VisibleProps,
} from '@shopify/restyle';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';

import { Theme } from '@/lib/restyle';

export type TextInputProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  TypographyProps<Theme> &
  ColorProps<Theme> &
  RNTextInputProps;

export const TextInput = createRestyleComponent<TextInputProps, Theme>(
  [spacing, visible, typography, color],
  createBox<Theme>(RNTextInput),
);
