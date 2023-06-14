import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BillDetails, BillParticipants, BillsByStatus } from '@/screens';

import { BottomTabNavigator } from './BottomTabNavigator';

export type AppRootStackParamList = {
  Home: undefined;
  'Bill Details': undefined;
  'Bill Participants': undefined;
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

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen component={BillDetails} name="Bill Details" />
        <AppRootStack.Screen component={BillParticipants} name="Bill Participants" />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
        <AppRootStack.Screen component={BillsByStatus} name="Bills By Status" />
      </AppRootStack.Group>
    </AppRootStack.Navigator>
  );
};
