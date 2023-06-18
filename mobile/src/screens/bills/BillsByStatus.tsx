import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Screen, Text } from '@/components';
import { AppRootStackParamList } from '@/navigation';

type BillsByStatusProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Bills By Status'
>;

export const BillsByStatus = ({ route }: BillsByStatusProps) => {
  const { status } = route.params;

  return (
    <Screen customScreenName={`${status} bills`} isModal>
      <Box flex={1} paddingHorizontal="6" paddingVertical="2">
        <Text>This is for "{status}" bills</Text>
      </Box>
    </Screen>
  );
};
