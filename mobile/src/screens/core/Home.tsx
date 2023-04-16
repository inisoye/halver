import * as React from 'react';

import { SafeAreaView, Text, View } from '@/components';

export const Home: React.FunctionComponent = () => {
  return (
    <SafeAreaView>
      <View className="bg-yellow-500 p-2">
        <Text>This is the home</Text>
      </View>

      <Text>gAbakalaiki</Text>
      <Text>
        <Text className="font-naira">₦</Text>
        <Text>24000</Text>
      </Text>
    </SafeAreaView>
  );
};
