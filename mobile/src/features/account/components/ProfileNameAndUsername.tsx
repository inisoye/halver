import * as React from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedBox, DynamicText } from '@/components';
import { brandColors } from '@/lib/restyle';

interface ProfileNameAndUsernameProps {
  fullName: string | undefined;
  username: string | undefined;
}

export const ProfileNameAndUsername: React.FunctionComponent<
  ProfileNameAndUsernameProps
> = ({ fullName, username }) => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [brandColors.casal8, brandColors.pharlap8],
        'HSV',
        {
          useCorrectedHSVInterpolation: true,
        },
      ),
    };
  });

  const animate = () => {
    progress.value = withRepeat(
      withTiming(1 - progress.value, { duration: 10000 }),
      -1,
      true,
    );
  };

  React.useEffect(() => {
    animate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatedBox
      backgroundColor="elementBackground"
      borderRadius="lg"
      elevation={1}
      flexGrow={1}
      gap="3"
      justifyContent="space-between"
      padding="4"
      shadowColor="black"
      shadowOffset={{
        width: 0.2,
        height: 0.2,
      }}
      shadowOpacity={0.2}
      shadowRadius={0.3}
      style={animatedStyle}
    >
      <DynamicText
        color="textWhite"
        fontFamily="Halver-Semibold"
        numberOfLines={2}
        variant="xl"
      >
        {fullName}
      </DynamicText>

      <DynamicText color="textWhite" fontFamily="Halver-Semibold" numberOfLines={1}>
        @{username}
      </DynamicText>
    </AnimatedBox>
  );
};
