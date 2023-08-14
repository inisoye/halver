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
    <AnimatedBox
      entering={ZoomInLeft.duration(600)}
      exiting={ZoomOutLeft.duration(600)}
      flexDirection="row"
      zIndex="10"
    >
      <AnimatedBox
        backgroundColor="logoApricot"
        height={8}
        marginRight="-2"
        style={[animatedStyleLeft]}
      />
      <AnimatedBox
        backgroundColor="logoCasal"
        height={8}
        marginLeft="-2"
        marginTop="2"
        style={[animatedStyleRight]}
      />
    </AnimatedBox>
  );
};
