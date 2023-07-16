import {
  createBox,
  createRestyleComponent,
  spacing,
  visible,
  type BoxProps,
  type SpacingProps,
  type VisibleProps,
} from '@shopify/restyle';
import { ScrollViewProps as RNScrollViewProps } from 'react-native';
import { ScrollView as RNGHScrollView } from 'react-native-gesture-handler';

import { Theme } from '@/lib/restyle';

export type ScrollViewProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  RNScrollViewProps;

export const ScrollView = createRestyleComponent<ScrollViewProps, Theme>(
  [spacing, visible],
  createBox<Theme>(RNGHScrollView),
);
