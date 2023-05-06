import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const springConfig = {
  damping: 4,
  mass: 1,
  stiffness: 600,
  overshootClamping: false,
};

export const useButtonAnimation = ({ animateScale = false, animateTranslate = true } = {}) => {
  const scale = useSharedValue(1);
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(offset.value, springConfig) },
      { scale: withSpring(scale.value, springConfig) },
    ],
    opacity: withSpring(opacity.value),
  }));

  const handlePressIn = () => {
    if (animateScale) scale.value = 0.97;
    if (animateTranslate) offset.value = 3;
    opacity.value = 0.6;
  };

  const handlePressOut = () => {
    if (animateScale) scale.value = 1;
    if (animateTranslate) offset.value = 0;
    opacity.value = 1;
  };

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
};
