import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Account, Cards, TransferRecipients } from '@/screens';

export type AccountStackParamList = {
  Account: undefined;
  'Edit profile image': undefined;
  'Edit phone number': undefined;
  Cards: undefined;
  'Transfer recipients': undefined;
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

      <AccountStack.Screen
        component={Cards}
        name="Cards"
        options={{
          headerShown: false,
        }}
      />

      <AccountStack.Screen
        component={TransferRecipients}
        name="Transfer recipients"
        options={{
          headerShown: false,
        }}
      />
    </AccountStack.Navigator>
  );
};
