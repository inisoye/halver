import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Screen, Text } from '@/components';
import { AppRootStackParamList } from '@/navigation';

type BillSummaryProps = NativeStackScreenProps<AppRootStackParamList, 'Bill Summary'>;

export const BillSummary: React.FunctionComponent<BillSummaryProps> = () => {
  return (
    <Screen>
      <Box paddingHorizontal="6" paddingVertical="2">
        <Text>This is the BillSummary screen</Text>
      </Box>
    </Screen>
  );
};
