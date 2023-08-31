import * as React from 'react';
import { Dimensions } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  ZoomInLeft,
  ZoomOutLeft,
} from 'react-native-reanimated';

import { AnimatedBox } from './Box';

const { width: screenWidth } = Dimensions.get('window');

export const LogoLoader: React.FunctionComponent = () => {
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

  /**
   * TS errors are ignored in the following lines due to type mismatch issues from Reanimated.
   * https://github.com/software-mansion/react-native-reanimated/issues/4548
   * https://github.com/software-mansion/react-native-reanimated/issues/4645
   * Review later if fixes are made.
   */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const animatedStyleLeft = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -translateX.value }],
      width: widthLeft.value,
    };
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
    <AnimatedBox
      entering={ZoomInLeft.duration(600)}
      // Exiting animation causes issues with modals on Android: https://github.com/software-mansion/react-native-reanimated/issues/4422#issuecomment-1580890555
      exiting={ZoomOutLeft.duration(300)}
      flexDirection="row"
      zIndex="10"
    >
      <AnimatedBox
        backgroundColor="logoApricot"
        height={6}
        marginRight="-2"
        style={[animatedStyleLeft]}
      />
      <AnimatedBox
        backgroundColor="logoCasal"
        height={6}
        marginLeft="-2"
        marginTop="1.5"
        style={[animatedStyleRight]}
      />
    </AnimatedBox>
  );
};
