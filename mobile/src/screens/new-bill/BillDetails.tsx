import * as React from 'react';

import { Screen, Text, View } from '@/components';

export const BillDetails: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6">
        <Text>This is the bill details</Text>
      </View>
    </Screen>
  );
};
