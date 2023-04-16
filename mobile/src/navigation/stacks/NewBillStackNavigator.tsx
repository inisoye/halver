import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BillAmount } from '@/screens';

export type NewBillStackParamList = {
  BillAmount: undefined;
};

const NewBillStack = createNativeStackNavigator<NewBillStackParamList>();

export const NewBillStackNavigator: React.FunctionComponent = () => {
  return (
    <NewBillStack.Navigator>
      <NewBillStack.Screen
        name="BillAmount"
        component={BillAmount}
        options={{
          headerShown: false,
        }}
      />
    </NewBillStack.Navigator>
  );
};
