import { createBox } from '@shopify/restyle';
import Animated from 'react-native-reanimated';

import { Theme } from '@/lib/restyle';

export const Box = createBox<Theme>();

export const AnimatedBox = Animated.createAnimatedComponent(Box);
