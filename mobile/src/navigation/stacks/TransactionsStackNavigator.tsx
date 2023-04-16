import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Transactions } from '@/screens';

export type TransactionsStackParamList = {
  Transactions: undefined;
};

const TransactionsStack = createNativeStackNavigator<TransactionsStackParamList>();

export const TransactionsStackNavigator: React.FunctionComponent = () => {
  return (
    <TransactionsStack.Navigator>
      <TransactionsStack.Screen
        name="Transactions"
        component={Transactions}
        options={{
          headerShown: false,
        }}
      />
    </TransactionsStack.Navigator>
  );
};
