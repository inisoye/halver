import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BillActionStatus } from '@/features/bills';
import { actionStatusColors } from '@/features/home';
import { Bill, Bills, BillsByStatus, ContributionsByDay } from '@/screens';

export type BillsStackParamList = {
  Bills: undefined;
  Bill: { id: string; name: string; shouldUpdate?: boolean; isOnRoot?: boolean };
  'Bill Payment': {
    actionId: string | undefined;
    status: BillActionStatus | undefined;
    billId: string;
    contribution: string | null | undefined;
    creditorName: string | undefined;
    deadline: string | null | undefined;
    deductionPattern: string | undefined;
    fee: string | null | undefined;
    firstChargeDate: string | null | undefined;
    name: string;
    isOnRoot?: boolean;
  };
  'Bills by status': { status: keyof typeof actionStatusColors };
  'Contributions by day': {
    id: string;
    totalAmountDue: number;
    name: string;
    totalAmountPaid: number;
  };
};

export const BillsStack = createNativeStackNavigator<BillsStackParamList>();

export const BillsStackNavigator: React.FunctionComponent = () => {
  return (
    <BillsStack.Navigator initialRouteName="Bills">
      <BillsStack.Screen
        component={Bills}
        name="Bills"
        options={{
          headerShown: false,
        }}
      />

      <BillsStack.Screen
        component={Bill}
        name="Bill"
        options={{
          headerShown: false,
        }}
      />

      <BillsStack.Screen
        component={BillsByStatus}
        name="Bills by status"
        options={{
          headerShown: false,
        }}
      />

      <BillsStack.Screen
        component={ContributionsByDay}
        name="Contributions by day"
        options={{
          headerShown: false,
        }}
      />
    </BillsStack.Navigator>
  );
};
