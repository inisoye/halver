import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BillDetails } from '@/screens';

import { BottomTabNavigator } from './BottomTabNavigator';

export type AppRootStackParamList = {
  Home: undefined;
  'Bill Details': undefined;
};

const AppRootStack = createNativeStackNavigator<AppRootStackParamList>();

export const AppRootStackNavigator: React.FunctionComponent = () => {
  return (
    <AppRootStack.Navigator>
      <AppRootStack.Screen
        component={BottomTabNavigator}
        name="Home"
        options={{
          headerShown: false,
        }}
      />
      <AppRootStack.Screen
        component={BillDetails}
        name="Bill Details"
        options={{
          headerShown: false,
        }}
      />
    </AppRootStack.Navigator>
  );
};
