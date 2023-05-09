import * as React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  ZoomInLeft,
  ZoomOutRight,
} from 'react-native-reanimated';

import { cn } from '@/utils';

const { width: screenWidth } = Dimensions.get('window');

interface LogoLoaderProps {
  className?: string;
}

export const LogoLoader: React.FunctionComponent<LogoLoaderProps> = ({ className }) => {
  const translateX = useSharedValue(0);
  const widthLeft = useSharedValue(20);
  const widthRight = useSharedValue(40);

  const animate = () => {
    translateX.value = withRepeat(
      withTiming(-screenWidth + (widthLeft.value + widthRight.value) - 16, {
        duration: 800,
      }),
      -1,
      true,
    );
    widthLeft.value = withRepeat(withSpring(40), -1, true);
    widthRight.value = withRepeat(withSpring(20), -1, true);
  };

  const animatedStyleLeft = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -translateX.value }],
      width: widthLeft.value,
    };
  });

  const animatedStyleRight = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -translateX.value }],
      width: widthRight.value,
    };
  });

  React.useEffect(() => {
    animate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      className={cn('z-10 h-4 flex-row', className)}
      entering={ZoomInLeft.duration(600)}
      exiting={ZoomOutRight.duration(600)}
    >
      <Animated.View
        className="-mr-2 h-2 bg-apricot-700 dark:bg-apricot"
        style={[animatedStyleLeft]}
      />
      <Animated.View
        className="-ml-2 mt-2 h-2 bg-casal-700 dark:bg-casal"
        style={[animatedStyleRight]}
      />
    </Animated.View>
  );
};
