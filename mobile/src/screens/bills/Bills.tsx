import * as React from 'react';
import { Text } from 'react-native';

import { SafeAreaView } from '@/components';

export const Bills: React.FunctionComponent = () => {
  return (
    <SafeAreaView>
      <Text className="font-sans-medium tracking-tight">This is the bills</Text>
    </SafeAreaView>
  );
};
