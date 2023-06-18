import * as React from 'react';

import { gapStyles } from '@/theme';

import { Box } from './Box';
import { Text } from './Text';

interface PaddedScreenHeaderProps {
  heading: string;
  subHeading: string;
  hasExtraPadding?: boolean;
}

export const PaddedScreenHeader: React.FunctionComponent<PaddedScreenHeaderProps> = ({
  heading,
  subHeading,
  hasExtraPadding,
}) => {
  return (
    <Box
      marginTop="5"
      paddingBottom="2"
      paddingHorizontal="6"
      paddingTop={hasExtraPadding ? '8' : '2'}
      style={gapStyles[8]}
    >
      <Text fontFamily="Halver-Semibold" variant="2xl">
        {heading}
      </Text>

      <Text color="textLight" variant="sm">
        {subHeading}
      </Text>
    </Box>
  );
};
