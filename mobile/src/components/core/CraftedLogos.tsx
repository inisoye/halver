import { BoxProps } from '@shopify/restyle';
import * as React from 'react';

import { Theme } from '@/lib/restyle';

import { Box } from './Box';
import { Text } from './Text';

interface CraftedLogoProps {
  hasText?: boolean;
  containerProps?: BoxProps<Theme>;
}

export const CraftedLogoSmall: React.FunctionComponent<CraftedLogoProps> = ({
  hasText,
  containerProps,
}) => {
  return (
    <Box alignItems="center" flexDirection="row" gap="2" {...containerProps}>
      {hasText && <Text variant="2xl">halver</Text>}

      <Box>
        <Box
          backgroundColor="logoApricot"
          height={6.25}
          marginLeft="0.75"
          width={16.67}
        />
        <Box
          backgroundColor="logoCasal"
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
      {hasText && <Text variant="3xl">halver</Text>}

      <Box>
        <Box backgroundColor="logoApricot" height={9.375} marginLeft="1" width={25} />
        <Box
          backgroundColor="logoCasal"
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
        <Box backgroundColor="logoApricot" height={18.75} marginLeft="2" width={50} />
        <Box
          backgroundColor="logoCasal"
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
