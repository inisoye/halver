import * as React from 'react';

import { Box, Screen, Text } from '@/components';

export const BillDetailsPlaceholder: React.FunctionComponent = () => {
  return (
    <Screen>
      <Box paddingHorizontal="6" paddingVertical="2">
        <Text>This is the BillDetails placeholder screen</Text>
      </Box>
    </Screen>
  );
};
