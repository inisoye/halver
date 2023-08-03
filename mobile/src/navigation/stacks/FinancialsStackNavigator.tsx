import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Financials, Transactions } from '@/screens';

export type FinancialsStackParamList = {
  Financials: undefined;
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
        component={Transactions}
        name="Transactions"
        options={{
          headerShown: false,
        }}
      />
    </FinancialsStack.Navigator>
  );
};
