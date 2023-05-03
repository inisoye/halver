import * as React from 'react';
import { View } from 'react-native';

import { Screen, Text } from '@/components';

export const CardDetails: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6">
        <Text>This is the card details</Text>
      </View>
    </Screen>
  );
};
