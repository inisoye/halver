import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Cards, Financials, Transactions, TransferRecipients } from '@/screens';

export type FinancialsStackParamList = {
  Financials: undefined;
  Cards: undefined;
  'Add your card': undefined;
  'Transfer recipients': undefined;
  'Add a recipient': undefined;
  Transactions: undefined;
};

const FinancialsStack = createNativeStackNavigator<FinancialsStackParamList>();

export const FinancialsStackNavigator: React.FunctionComponent = () => {
  return (
    <FinancialsStack.Navigator>
      <FinancialsStack.Screen
        component={Financials}
        name="Financials"
        options={{
          headerShown: false,
        }}
      />

      <FinancialsStack.Screen
        component={Cards}
        name="Cards"
        options={{
          headerShown: false,
        }}
      />

      <FinancialsStack.Screen
        component={TransferRecipients}
        name="Transfer recipients"
        options={{
          headerShown: false,
        }}
      />

      <FinancialsStack.Screen
        component={Transactions}
        name="Transactions"
        options={{
          headerShown: false,
        }}
      />
    </FinancialsStack.Navigator>
  );
};
