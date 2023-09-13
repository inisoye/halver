import * as React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Box, LinearGradient, Text } from '@/components';
import { Donation, MultipleContributions, SplitPayments, Subscriptions } from '@/icons';
import { colors } from '@/theme';

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: '100%',
    height: 242,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },

  icon: {
    position: 'absolute',
    bottom: 32,
    right: 32,
  },

  subHeading: {
    maxWidth: 273,
  },
});

const SLIDER_CONTENT = [
  {
    backgroundColor: colors['grey-dark'][200],
    mainHeading: 'Split payments, delightfully',
    subHeading: 'Put an end to the awkwardness of paying group bills at restaurants',
    Icon: SplitPayments,
    isDark: true,
    mainHeadingMaxWidth: 200,
  },
  {
    backgroundColor: colors.apricot.DEFAULT,
    mainHeading: 'Automatically share subscription costs',
    subHeading:
      'Collect contributions for Netflix, Spotify Family, and more, with ease',
    Icon: Subscriptions,
    isDark: false,
    mainHeadingMaxWidth: 250,
  },
  {
    backgroundColor: colors.casal.DEFAULT,
    mainHeading: 'Split your bills with as many people as you want',
    subHeading:
      'Drive costs down by adding more people to a bill. The more the merrier',
    Icon: MultipleContributions,
    isDark: true,
    mainHeadingMaxWidth: 270,
  },
  {
    backgroundColor: colors.pharlap.DEFAULT,
    mainHeading: 'Track crowdfunded money without any foreign affiliations',
    subHeading:
      'Forget GoFundMe. Raise money from Nigerians with your Nigerian bank account.',
    Icon: Donation,
    isDark: false,
    mainHeadingMaxWidth: 257,
  },
];

export const IntroMarquee: React.FunctionComponent = () => {
  const card = useSharedValue(0);
  const totalHeight = customStyles.card.height * SLIDER_CONTENT.length;

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  /**
   * TS errors are ignored in the following lines due to type mismatch issues from Reanimated.
   * https://github.com/software-mansion/react-native-reanimated/issues/4548
   * https://github.com/software-mansion/react-native-reanimated/issues/4645
   * Review later if fixes are made.
   */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const cardAnimatedStyle = useAnimatedStyle(() => {
    // -55 is used here as an offset. It ensures the slider covers the screen at the animation start.
    const yValue = interpolate(
      card.value,
      [0, 1],
      [-55, -totalHeight - 55],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ translateY: yValue }],
    };
  });

  React.useEffect(() => {
    card.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box backgroundColor="darkBackground" flex={1}>
        {SLIDER_CONTENT.map(
          ({
            backgroundColor,
            mainHeading,
            subHeading,
            isDark,
            Icon,
            mainHeadingMaxWidth,
          }) => {
            return (
              <Animated.View
                key={mainHeading}
                style={[customStyles.card, cardAnimatedStyle, { backgroundColor }]}
              >
                <Text
                  color={isDark ? 'textIntroMarqueeDark' : 'textIntroMarqueeLight'}
                  fontFamily="Halver-Semibold"
                  lineHeight={24}
                  marginBottom="6"
                  style={{ maxWidth: mainHeadingMaxWidth }}
                  variant="xl"
                >
                  {mainHeading}
                </Text>
                <Text
                  color={isDark ? 'textIntroMarqueeDark' : 'textIntroMarqueeLight'}
                  lineHeight={17}
                  opacity={0.7}
                  style={customStyles.subHeading}
                  variant="sm"
                >
                  {subHeading}
                </Text>

                <Icon style={customStyles.icon} />
              </Animated.View>
            );
          },
        )}

        {SLIDER_CONTENT.map(
          ({
            backgroundColor,
            mainHeading,
            subHeading,
            isDark,
            Icon,
            mainHeadingMaxWidth,
          }) => {
            return (
              <Animated.View
                key={mainHeading}
                style={[customStyles.card, cardAnimatedStyle, { backgroundColor }]}
              >
                <Text
                  color={isDark ? 'textIntroMarqueeDark' : 'textIntroMarqueeLight'}
                  fontFamily="Halver-Semibold"
                  lineHeight={24}
                  marginBottom="6"
                  style={{ maxWidth: mainHeadingMaxWidth }}
                  variant="xl"
                >
                  {mainHeading}
                </Text>
                <Text
                  color={isDark ? 'textIntroMarqueeDark' : 'textIntroMarqueeLight'}
                  lineHeight={17}
                  opacity={0.7}
                  style={customStyles.subHeading}
                  variant="sm"
                >
                  {subHeading}
                </Text>

                <Icon style={customStyles.icon} />
              </Animated.View>
            );
          },
        )}

        <Box
          bottom={0}
          flex={1}
          height={windowHeight}
          left={0}
          pointerEvents="none"
          position="absolute"
          right={0}
          top={0}
          width={windowWidth}
        >
          <LinearGradient
            bottom={0}
            colors={['transparent', 'rgba(0,0,0,1)']}
            height="100%"
            left={0}
            right={0}
            top={0}
          />
        </Box>
      </Box>
    </>
  );
};
