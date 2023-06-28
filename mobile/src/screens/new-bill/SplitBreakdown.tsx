import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Screen, Text } from '@/components';
import { AppRootStackParamList } from '@/navigation';

type SplitBreakdownProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Split Breakdown'
>;

export const SplitBreakdown: React.FunctionComponent<SplitBreakdownProps> = () => {
  return (
    <Screen>
      <Box paddingHorizontal="6" paddingVertical="2">
        <Text>This is the Split Breakdown</Text>
      </Box>
    </Screen>
  );
};
