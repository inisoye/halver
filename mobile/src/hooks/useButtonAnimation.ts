import * as React from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const springConfig = {
  damping: 4,
  mass: 1,
  stiffness: 600,
  overshootClamping: false,
};

export const useButtonAnimation = ({
  animateScale = false,
  animateTranslate = true,
  animateOpacity = true,
  disabled = false,
  animationOn = true,
} = {}) => {
  const scale = useSharedValue(1);
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  /**
   * TS errors are ignored in the following lines due to type mismatch issues from Reanimated.
   * https://github.com/software-mansion/react-native-reanimated/issues/4548
   * https://github.com/software-mansion/react-native-reanimated/issues/4645
   * Review later if fixes are made.
   */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(offset.value, springConfig) },
        { scale: withSpring(scale.value, springConfig) },
      ],
      opacity: withSpring(opacity.value),
    };
  });

  const handlePressIn = () => {
    if (animateScale && animationOn) scale.value = 0.97;
    if (animateTranslate && animationOn) offset.value = 2;
    if (!disabled && animateOpacity) opacity.value = 0.6;
  };

  const handlePressOut = () => {
    if (animateScale && animationOn) scale.value = 1;
    if (animateTranslate && animationOn) offset.value = 0;
    if (!disabled && animateOpacity) opacity.value = 1;
  };

  React.useEffect(() => {
    if (disabled) {
      opacity.value = 0.5;
    } else {
      opacity.value = 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
};
