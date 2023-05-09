import * as React from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const springConfig = {
  damping: 4,
  mass: 1,
  stiffness: 600,
  overshootClamping: false,
};

export const useButtonAnimation = ({
  animateScale = false,
  animateTranslate = true,
  disabled = false,
} = {}) => {
  const scale = useSharedValue(1);
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

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
    if (animateScale) scale.value = 0.97;
    if (animateTranslate) offset.value = 3;
    opacity.value = 0.6;
  };

  const handlePressOut = () => {
    if (animateScale) scale.value = 1;
    if (animateTranslate) offset.value = 0;
    if (!disabled) {
      opacity.value = 1;
    }
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
