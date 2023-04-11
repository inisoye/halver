import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import { Account } from "@/screens";


interface AccountStackNavigatorProps {}

export type AccountStackParamList = {
  Account: undefined;
};

const AccountStack = createNativeStackNavigator<AccountStackParamList>();

export const AccountStackNavigator: React.FunctionComponent<
  AccountStackNavigatorProps
> = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
    </AccountStack.Navigator>
  );
};
