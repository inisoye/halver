import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BillActionStatus } from '@/features/bills';
import { Bill, BillPayment, Bills } from '@/screens';

export type BillsStackParamList = {
  Bills: undefined;
  Bill: { id: string; name: string; shouldUpdate?: boolean };
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
  };
};

const BillsStack = createNativeStackNavigator<BillsStackParamList>();

export const BillsStackNavigator: React.FunctionComponent = () => {
  return (
    <BillsStack.Navigator>
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
        component={BillPayment}
        name="Bill Payment"
        options={{
          headerShown: false,
        }}
      />
    </BillsStack.Navigator>
  );
};
