import {
  createBox,
  createRestyleComponent,
  spacing,
  visible,
  type BoxProps,
  type SpacingProps,
  type VisibleProps,
} from '@shopify/restyle';
import RNPagerView, {
  PagerViewProps as RNPagerViewProps,
} from 'react-native-pager-view';

import { Theme } from '@/lib/restyle';

export type PagerViewProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  RNPagerViewProps;

export const PagerView = createRestyleComponent<PagerViewProps, Theme>(
  [spacing, visible],
  createBox<Theme>(RNPagerView),
);
