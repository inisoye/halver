import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Home } from '@/screens';

export type HomeStackParamList = {
  Home: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FunctionComponent = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};
