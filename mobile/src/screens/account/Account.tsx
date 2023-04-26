import * as React from 'react';
import { View } from 'react-native';

import { Screen, Text } from '@/components';

export const Account: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6">
        <Text className="mb-4">This is the account</Text>
      </View>
    </Screen>
  );
};
