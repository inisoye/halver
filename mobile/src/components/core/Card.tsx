import {
  BorderProps,
  BoxProps,
  createRestyleComponent,
  createVariant,
  spacing,
  SpacingProps,
  VariantProps,
} from '@shopify/restyle';

import { Theme } from '@/lib/restyle';

type Props = BoxProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  VariantProps<Theme, 'cardVariants'> & {
    children?: React.ReactNode;
  };

export const Card = createRestyleComponent<Props, Theme>([
  spacing,
  createVariant({ themeKey: 'cardVariants' }),
]);
