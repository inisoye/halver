import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BillDetails, BillsByStatus } from '@/screens';

import { BottomTabNavigator } from './BottomTabNavigator';

export type AppRootStackParamList = {
  Home: undefined;
  'Bill Amount': undefined;
  'Bill Details': undefined;
  'Bills By Status': { status: string };
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

      <AppRootStack.Group>
        <AppRootStack.Screen
          component={BillDetails}
          name="Bill Details"
          options={{
            headerShown: false,
          }}
        />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
        <AppRootStack.Screen component={BillsByStatus} name="Bills By Status" />
      </AppRootStack.Group>
    </AppRootStack.Navigator>
  );
};
