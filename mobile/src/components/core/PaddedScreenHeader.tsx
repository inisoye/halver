import * as React from 'react';
import { View } from 'react-native';

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
    // eslint-disable-next-line react-native/no-inline-styles
    <View className={cn('mt-5 p-2 px-6', hasExtraPadding && 'pt-12')} style={{ gap: 8 }}>
      <Text variant="2xl">{heading}</Text>

      <Text variant="sm" isLight>
        {subHeading}
      </Text>
    </View>
  );
};
