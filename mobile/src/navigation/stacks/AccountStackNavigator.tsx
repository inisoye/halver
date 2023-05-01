import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Account } from '@/screens';

export type AccountStackParamList = {
  Account: undefined;
};

const AccountStack = createNativeStackNavigator<AccountStackParamList>();

export const AccountStackNavigator: React.FunctionComponent = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        component={Account}
        name="Account"
        options={{
          headerShown: false,
        }}
      />
    </AccountStack.Navigator>
  );
};
