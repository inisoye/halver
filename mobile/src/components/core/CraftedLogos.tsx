import { BoxProps } from '@shopify/restyle';
import * as React from 'react';
import { FadeInLeft, FadeInRight } from 'react-native-reanimated';

import { Theme } from '@/lib/restyle';

import { AnimatedBox, Box } from './Box';
import { Text } from './Text';

interface CraftedLogoProps {
  hasText?: boolean;
  containerProps?: BoxProps<Theme>;
}

export const CraftedLogoSmallest: React.FunctionComponent<CraftedLogoProps> = ({
  hasText,
  containerProps,
}) => {
  return (
    <Box alignItems="center" flexDirection="row" gap="2" {...containerProps}>
      {hasText && <Text>halver</Text>}

      <Box>
        <AnimatedBox
          backgroundColor="logoApricot"
          entering={FadeInRight.springify().duration(2000)}
          height={4.7}
          marginLeft="0.75"
          width={12.5}
        />
        <AnimatedBox
          backgroundColor="logoCasal"
          entering={FadeInLeft.springify().duration(2000)}
          height={4.7}
          marginLeft="1.5"
          marginTop=".75"
          width={12.5}
        />
        <Box
          backgroundColor="background"
          height="100%"
          left={11}
          position="absolute"
          width={0.75}
        />
      </Box>
    </Box>
  );
};

export const CraftedLogoSmall: React.FunctionComponent<CraftedLogoProps> = ({
  hasText,
  containerProps,
}) => {
  return (
    <Box alignItems="center" flexDirection="row" gap="2" {...containerProps}>
      {hasText && <Text>halver</Text>}

      <Box>
        <AnimatedBox
          backgroundColor="logoApricot"
          entering={FadeInRight.springify().duration(2000)}
          height={6.25}
          marginLeft="0.75"
          width={16.67}
        />
        <AnimatedBox
          backgroundColor="logoCasal"
          entering={FadeInLeft.springify().duration(2000)}
          height={6.25}
          marginLeft="1.5"
          marginTop="px"
          width={16.67}
        />
        <Box
          backgroundColor="background"
          height="100%"
          left={12}
          position="absolute"
          width={1}
        />
      </Box>
    </Box>
  );
};

export const CraftedLogo: React.FunctionComponent<CraftedLogoProps> = ({
  hasText,
  containerProps,
}) => {
  return (
    <Box alignItems="center" flexDirection="row" gap="3" {...containerProps}>
      {hasText && (
        <Text fontSize={26} variant="3xl">
          halver
        </Text>
      )}

      <Box>
        <AnimatedBox
          backgroundColor="logoApricot"
          entering={FadeInRight.springify().duration(2000)}
          height={9.375}
          marginLeft="1"
          width={25}
        />
        <AnimatedBox
          backgroundColor="logoCasal"
          entering={FadeInLeft.springify().duration(2000)}
          height={9.375}
          marginLeft="2"
          marginTop="px.5"
          width={25}
        />
        <Box
          backgroundColor="background"
          height="100%"
          left={18}
          position="absolute"
          width={1.5}
        />
      </Box>
    </Box>
  );
};

export const CraftedLogoLarge: React.FunctionComponent<CraftedLogoProps> = ({
  hasText,
  containerProps,
}) => {
  return (
    <Box alignItems="center" flexDirection="row" gap="3" {...containerProps}>
      {hasText && (
        <Text fontSize={48} letterSpacing={-2.4}>
          halver
        </Text>
      )}

      <Box>
        <AnimatedBox
          backgroundColor="logoApricot"
          entering={FadeInRight.springify().duration(2000)}
          height={18.75}
          marginLeft="2"
          width={50}
        />
        <AnimatedBox
          backgroundColor="logoCasal"
          entering={FadeInLeft.springify().duration(2000)}
          height={18.75}
          marginLeft="4"
          marginTop="0.75"
          width={50}
        />
        <Box
          backgroundColor="background"
          height="100%"
          left={36}
          position="absolute"
          width={3}
        />
      </Box>
    </Box>
  );
};
