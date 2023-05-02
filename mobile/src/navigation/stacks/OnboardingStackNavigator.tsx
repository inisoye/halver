import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { BankAccountDetails, Login, MoreUserDetails } from '@/screens';

export type OnboardingStackParamList = {
  Login: undefined;
  MoreUserDetails: undefined;
  BankAccountDetails: undefined;
};

interface OnboardingStackProps {
  userDetailsStatus: 'No token' | 'No phone' | 'No card' | 'No transfer recipient' | 'No photo';
}

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingStackNavigator: React.FunctionComponent<OnboardingStackProps> = ({
  userDetailsStatus,
}) => {
  return (
    <OnboardingStack.Navigator>
      {userDetailsStatus === 'No token' && (
        <OnboardingStack.Screen
          component={Login}
          name="Login"
          options={{
            headerShown: false,
          }}
        />
      )}

      {userDetailsStatus === 'No phone' && (
        <OnboardingStack.Screen
          component={MoreUserDetails}
          name="MoreUserDetails"
          options={{
            headerShown: false,
          }}
        />
      )}

      {userDetailsStatus === 'No transfer recipient' && (
        <OnboardingStack.Screen
          component={BankAccountDetails}
          name="BankAccountDetails"
          options={{
            headerShown: false,
          }}
        />
      )}

      {userDetailsStatus === 'No card' && (
        <OnboardingStack.Screen
          component={MoreUserDetails}
          name="MoreUserDetails"
          options={{
            headerShown: false,
          }}
        />
      )}

      {userDetailsStatus === 'No transfer recipient' && (
        <OnboardingStack.Screen
          component={MoreUserDetails}
          name="MoreUserDetails"
          options={{
            headerShown: false,
          }}
        />
      )}
    </OnboardingStack.Navigator>
  );
};
