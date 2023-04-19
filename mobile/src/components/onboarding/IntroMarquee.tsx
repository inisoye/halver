import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import React from 'react';
import { View as RNView, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Donation, MultipleContributions, SplitPayments, Subscriptions } from '@/icons';
import { colors } from '@/theme';
import { cn } from '@/utils';

import { Text, View } from '../core';

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 242,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
});

const StyledLinearGradient = styled(LinearGradient);

const TRANSITION_OFFSET = -55;

const SLIDER_CONTENT = [
  {
    backgroundColor: colors['grey-dark'][200],
    mainHeading: 'Split payments, delightfully',
    subHeading: 'Put an end to the awkwardness of paying group bills at restaurants',
    Icon: SplitPayments,
    isDark: true,
    mainHeadingClassName: 'max-w-[132px]',
  },
  {
    backgroundColor: colors.apricot.DEFAULT,
    mainHeading: 'Automatically share subscription costs',
    subHeading: 'Collect contributions for Netflix, Spotify Family, and more, with ease',
    Icon: Subscriptions,
    isDark: false,
    mainHeadingClassName: 'max-w-[189px]',
  },
  {
    backgroundColor: colors.casal.DEFAULT,
    mainHeading: 'Split your bills with as many people as you want',
    subHeading: 'Drive costs down by adding more people to a bill. The more, the merrier',
    Icon: MultipleContributions,
    isDark: true,
    mainHeadingClassName: 'max-w-[219px]',
  },
  {
    backgroundColor: colors.pharlap.DEFAULT,
    mainHeading: 'Track crowdfunded money without any foreign affiliations',
    subHeading: 'Forget GoFundMe. Raise money from Nigerians with your Nigerian bank account.',
    Icon: Donation,
    isDark: false,
    mainHeadingClassName: 'max-w-[257px]',
  },
];

export const IntroMarquee: React.FunctionComponent = () => {
  const bar = useSharedValue(0);
  const totalHeight = styles.bar.height * 4;

  const barStyle = useAnimatedStyle(() => {
    const yValue = interpolate(
      bar.value,
      [0, 1],
      [TRANSITION_OFFSET, -totalHeight + TRANSITION_OFFSET],
      Extrapolate.IDENTITY,
    );

    return {
      transform: [{ translateY: yValue }],
    };
  });

  React.useEffect(() => {
    bar.value = withRepeat(withTiming(1, { duration: 30000, easing: Easing.linear }), -1, false);
  }, [bar]);

  return (
    <>
      <View className="flex-1">
        {SLIDER_CONTENT.map(
          ({ backgroundColor, mainHeading, subHeading, isDark, Icon, mainHeadingClassName }) => {
            return (
              <Animated.View key={mainHeading} style={[styles.bar, barStyle, { backgroundColor }]}>
                <Text
                  className={cn(
                    'mb-6 max-w-[70%] leading-[24px] text-grey-dark-1000',
                    isDark ? 'text-grey-dark-1000' : 'text-grey-dark-200',
                    mainHeadingClassName,
                  )}
                  variant="xl"
                >
                  {mainHeading}
                </Text>
                <Text
                  className={cn(
                    'max-w-[273px] leading-[17px] text-grey-dark-1000 opacity-70',
                    isDark ? 'text-grey-dark-1000' : 'text-grey-dark-200',
                  )}
                  variant="sm"
                >
                  {subHeading}
                </Text>

                <Icon className="absolute bottom-8 right-8" />
              </Animated.View>
            );
          },
        )}

        {SLIDER_CONTENT.map(
          ({ backgroundColor, mainHeading, subHeading, isDark, Icon, mainHeadingClassName }) => {
            return (
              <Animated.View key={mainHeading} style={[styles.bar, barStyle, { backgroundColor }]}>
                <Text
                  className={cn(
                    'mb-6 max-w-[70%] leading-[24px] text-grey-dark-1000',
                    isDark ? 'text-grey-dark-1000' : 'text-grey-dark-200',
                    mainHeadingClassName,
                  )}
                  variant="xl"
                >
                  {mainHeading}
                </Text>
                <Text
                  className={cn(
                    'max-w-[273px] leading-[17px] text-grey-dark-1000 opacity-70',
                    isDark ? 'text-grey-dark-1000' : 'text-grey-dark-200',
                  )}
                  variant="sm"
                >
                  {subHeading}
                </Text>

                <Icon className="absolute bottom-8 right-8" />
              </Animated.View>
            );
          },
        )}

        <RNView className="absolute inset-0 h-screen w-screen flex-1">
          <StyledLinearGradient
            className="inset-0 left-0 right-0 top-0 h-full"
            colors={['transparent', 'rgba(0,0,0,0.9)']}
          />
        </RNView>
      </View>
    </>
  );
};
