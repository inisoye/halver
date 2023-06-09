import * as React from 'react';
import { View } from 'react-native';

import { gapStyles } from '@/theme';
import { cn } from '@/utils';

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
    <View
      className={cn('mt-5 p-2 px-6', hasExtraPadding && 'pt-8')}
      style={gapStyles[8]}
    >
      <Text variant="2xl" weight="bold">
        {heading}
      </Text>

      <Text color="light" variant="sm">
        {subHeading}
      </Text>
    </View>
  );
};
