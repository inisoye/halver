import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import React, { useEffect } from 'react';
import { View as RNView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 242,
    backgroundColor: 'red',
  },
});

const StyledLinearGradient = styled(LinearGradient);

const Bar = () => {
  const bar = useSharedValue(0);
  const totalHeight = styles.bar.height * 4;

  const barStyle = useAnimatedStyle(() => {
    const yValue = interpolate(bar.value, [0, 1], [-55, -totalHeight - 55], Extrapolate.IDENTITY);

    return {
      transform: [{ translateY: yValue }],
    };
  });

  useEffect(() => {
    bar.value = withRepeat(withTiming(1, { duration: 30000, easing: Easing.linear }), -1, false);
  }, [bar]);

  return (
    <RNView className="absolute inset-0 h-screen w-screen flex-1">
      <View className="flex-1">
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'red' }]} />
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'pink' }]} />
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'yellow' }]} />
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'green' }]} />
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'red' }]} />
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'pink' }]} />
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'yellow' }]} />
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: 'green' }]} />
      </View>

      <StyledLinearGradient
        // Background Linear Gradient
        className="inset-0 left-0 right-0 top-0 h-full bg-black"
        colors={['transparent', 'rgba(0,0,0,0.9)']}
      />
    </RNView>
  );
};

export default Bar;
