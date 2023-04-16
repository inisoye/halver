import * as React from 'react';

import { SafeAreaView, Text, View } from '@/components';
import { Home as HomeIcon } from '@/icons';

export const Home: React.FunctionComponent = () => {
  return (
    <SafeAreaView>
      <View className="bg-yellow-500 p-2">
        <Text className="text-grey-dark-50">This is the home</Text>
      </View>
      <HomeIcon />
      <Text>gAbakalaiki</Text>
      <Text>
        <Text className="font-naira">₦</Text>
        <Text>24000</Text>
      </Text>
    </SafeAreaView>
  );
};
