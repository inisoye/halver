import {
  BoxProps,
  color,
  ColorProps,
  createBox,
  createRestyleComponent,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  visible,
  VisibleProps,
} from '@shopify/restyle';
import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import Animated from 'react-native-reanimated';

import { Theme } from '@/lib/restyle';

export type ImageProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme> &
  ExpoImageProps;

export const Image = createRestyleComponent<ImageProps, Theme>(
  [spacing, visible, color, layout],
  createBox<Theme>(ExpoImage),
);

export const AnimatedImage = Animated.createAnimatedComponent(Image);
