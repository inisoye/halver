import * as React from 'react';

import { Screen, Text, View } from '@/components';

export const Account: React.FunctionComponent = () => {
  return (
    <Screen>
      <View className="p-2 px-6">
        <Text>This is the account</Text>
      </View>
    </Screen>
  );
};
