import * as React from 'react';
import { View } from 'react-native';

import { Screen, Text } from '@/components';

export const BillDetailsPlaceholder: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6 opacity-0">
        <Text>This is the BillDetails placeholder screen</Text>
      </View>
    </Screen>
  );
};
