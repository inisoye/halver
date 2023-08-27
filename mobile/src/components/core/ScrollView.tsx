import {
  createBox,
  createRestyleComponent,
  spacing,
  visible,
  type BoxProps,
  type SpacingProps,
  type VisibleProps,
} from '@shopify/restyle';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
} from 'react-native';

import { Theme } from '@/lib/restyle';

export type ScrollViewProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  RNScrollViewProps;

export const ScrollView = createRestyleComponent<ScrollViewProps, Theme>(
  [spacing, visible],
  createBox<Theme>(RNScrollView),
);
