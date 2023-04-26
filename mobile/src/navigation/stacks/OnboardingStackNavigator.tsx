import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BankAccountDetails, Login, MoreUserDetails } from '@/screens';

export type OnboardingStackParamList = {
  Login: undefined;
  MoreUserDetails: undefined;
  BankAccountDetails: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingStackNavigator: React.FunctionComponent = () => {
  return (
    <OnboardingStack.Navigator>
      <OnboardingStack.Screen
        component={Login}
        name="Login"
        options={{
          headerShown: false,
        }}
      />
      <OnboardingStack.Screen
        component={MoreUserDetails}
        name="MoreUserDetails"
        options={{
          headerShown: false,
        }}
      />
      <OnboardingStack.Screen
        component={BankAccountDetails}
        name="BankAccountDetails"
        options={{
          headerShown: false,
        }}
      />
    </OnboardingStack.Navigator>
  );
};
