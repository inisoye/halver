import * as React from 'react';

import { Box, Screen, Text } from '@/components';

export const Financials: React.FunctionComponent = () => {
  return (
    <Screen>
      <Box flex={1} paddingHorizontal="6" paddingVertical="2">
        <Text>This is the Financials</Text>
      </Box>
    </Screen>
  );
};
