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
        name="Home"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <AppRootStack.Screen
        name="Bill Details"
        component={BillDetails}
        options={{
          headerShown: false,
        }}
      />
    </AppRootStack.Navigator>
  );
};
