import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Bill, Bills } from '@/screens';

export type BillsStackParamList = {
  Bills: undefined;
  Bill: { id: string; name: string };
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
    </BillsStack.Navigator>
  );
};
