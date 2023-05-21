import * as React from 'react';
import { View } from 'react-native';

import { Screen, Text } from '@/components';

export const BillAmountPlaceholder: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6 opacity-0">
        <Text>This is the bill amount placeholder screen</Text>
      </View>
    </Screen>
  );
};
