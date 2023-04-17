import * as React from 'react';

import { Screen, Text, View } from '@/components';

export const Login: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6">
        <Text>This is the login</Text>
      </View>
    </Screen>
  );
};
