import * as React from 'react';
import { View } from 'react-native';

import { Screen, Text } from '@/components';

export const MoreUserDetails: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6">
        <Text>This is the more user details</Text>
      </View>
    </Screen>
  );
};
