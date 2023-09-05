import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { actionStatusColors } from '@/features/home';
import {
  Bill,
  BillsByStatus,
  ContributionsByDay,
  Home,
  Transactions,
  TransactionsInContributionRound,
} from '@/screens';

export type HomeStackParamList = {
  Home: undefined;
  Bill: { id: string; name: string; shouldUpdate?: boolean; isOnRoot?: boolean };
  'Bills by status': { status: keyof typeof actionStatusColors };
  'Contributions by day': {
    id: string;
    totalAmountDue: number;
    name: string;
    totalAmountPaid: number;
  };
  'Transactions in countribution round': {
    id: string;
    day: string | undefined;
    billName: string;
  };
  Transactions: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FunctionComponent = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        component={Home}
        name="Home"
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        component={Bill}
        name="Bill"
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        component={BillsByStatus}
        name="Bills by status"
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        component={ContributionsByDay}
        name="Contributions by day"
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        component={TransactionsInContributionRound}
        name="Transactions in countribution round"
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        component={Transactions}
        name="Transactions"
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};
