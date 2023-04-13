import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import { Bills } from "@/screens";


interface BillsStackNavigatorProps {}

export type BillsStackParamList = {
  Bills: undefined;
};

const BillsStack = createNativeStackNavigator<BillsStackParamList>();

export const BillsStackNavigator: React.FunctionComponent<
  BillsStackNavigatorProps
> = () => {
  return (
    <BillsStack.Navigator>
      <BillsStack.Screen
        name="Bills"
        component={Bills}
        options={{
          headerShown: false,
        }}
      />
    </BillsStack.Navigator>
  );
};
