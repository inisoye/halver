import * as React from 'react';
import { Text, View } from 'react-native';

import { SafeAreaView } from '@/components';

export const Home: React.FunctionComponent = () => {
  return (
    <SafeAreaView>
      <View className="bg-yellow-500 p-2">
        <Text style={{ fontFamily: 'Halver-Medium', letterSpacing: -0.16 }}>This is the home</Text>
      </View>

      <Text
        style={{
          fontFamily: 'Halver-Semibold',
          fontSize: 24,
          letterSpacing: -0.64,
        }}
      >
        gAbakalaiki
      </Text>
      <Text
        style={{
          fontSize: 24,
          letterSpacing: -0.64,
        }}
      >
        <Text
          style={{
            fontFamily: 'Halver-Naira',
          }}
        >
          ₦
        </Text>
        <Text
          style={{
            fontFamily: 'Halver-Semibold',
          }}
        >
          24000
        </Text>
      </Text>
    </SafeAreaView>
  );
};
