import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import {
  Bill,
  Cards,
  ContributionsByDay,
  Financials,
  Transactions,
  TransferRecipients,
} from '@/screens';

export type FinancialsStackParamList = {
  Financials: undefined;
  Cards: undefined;
  'Add your card': undefined;
  'Transfer recipients': undefined;
  'Add a recipient': undefined;
  Transactions: undefined;

  Bill: { id: string; name: string; shouldUpdate?: boolean; isOnRoot?: boolean };
  'Contributions by day': {
    id: string;
    totalAmountDue: number;
    name: string;
    totalAmountPaid: number;
  };
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

      <FinancialsStack.Screen
        component={Bill}
        name="Bill"
        options={{
          headerShown: false,
        }}
      />

      <FinancialsStack.Screen
        component={ContributionsByDay}
        name="Contributions by day"
        options={{
          headerShown: false,
        }}
      />
    </FinancialsStack.Navigator>
  );
};
