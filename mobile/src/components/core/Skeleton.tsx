import { BorderProps, BoxProps, SpacingProps } from '@shopify/restyle';
import * as React from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { darkColors, lightColors, Theme } from '@/lib/restyle';
import { useIsDarkModeSelected } from '@/utils';

import { AnimatedBox, Box } from './Box';
import { Text } from './Text';

type SkeletonProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> & {
    children?: React.ReactNode;
  };

export const Skeleton: React.FunctionComponent<SkeletonProps> = ({
  children,
  ...props
}) => {
  const isDarkMode = useIsDarkModeSelected();

  const progress = useSharedValue(isDarkMode ? 0.3 : 0.4);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isDarkMode ? darkColors.gray6 : lightColors.gray7,
      opacity: progress.value,
    };
  });

  const animate = () => {
    progress.value = withRepeat(
      withTiming(isDarkMode ? 0.9 : 1, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true,
    );
  };

  React.useEffect(() => {
    animate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatedBox style={animatedStyle} {...props}>
      <Box height={0} opacity={1}>
        <Text
          accessibilityHint="This content provides additional information."
          accessibilityLabel="This text is for screen readers only."
        >
          Loading
        </Text>
      </Box>

      {children}
    </AnimatedBox>
  );
};
