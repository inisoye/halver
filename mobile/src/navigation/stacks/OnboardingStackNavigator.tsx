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
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <OnboardingStack.Screen
        name="MoreUserDetails"
        component={MoreUserDetails}
        options={{
          headerShown: false,
        }}
      />
      <OnboardingStack.Screen
        name="BankAccountDetails"
        component={BankAccountDetails}
        options={{
          headerShown: false,
        }}
      />
    </OnboardingStack.Navigator>
  );
};
