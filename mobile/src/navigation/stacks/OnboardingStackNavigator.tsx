import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { FullScreenLoader } from '@/components';
import { useUserDetails } from '@/features/account';
import {
  BankAccountDetails,
  CardDetails,
  Phone,
  ProfileImage,
} from '@/screens';

export type OnboardingStackParamList = {
  Login: undefined;
  Phone: undefined;
  BankAccountDetails: undefined;
  CardDetails: undefined;
  ProfileImage: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingStackNavigator: React.FunctionComponent = () => {
  const { data: userDetails, isLoading } = useUserDetails();
  const {
    phone,
    defaultCard,
    defaultTransferRecipient,
    profileImageHash,
    profileImageUrl,
  } = userDetails || {};

  if (isLoading) {
    return (
      <FullScreenLoader
        isVisible={isLoading}
        message="Obtaining your details..."
      />
    );
  }

  return (
    <OnboardingStack.Navigator>
      {!phone && (
        <OnboardingStack.Screen
          component={Phone}
          name="Phone"
          options={{
            headerShown: false,
          }}
        />
      )}

      {!defaultTransferRecipient && (
        <OnboardingStack.Screen
          component={BankAccountDetails}
          name="BankAccountDetails"
          options={{
            headerShown: false,
          }}
        />
      )}

      {!defaultCard && (
        <OnboardingStack.Screen
          component={CardDetails}
          name="CardDetails"
          options={{
            headerShown: false,
          }}
        />
      )}

      {(!profileImageHash || !profileImageUrl) && (
        <OnboardingStack.Screen
          component={ProfileImage}
          name="ProfileImage"
          options={{
            headerShown: false,
          }}
        />
      )}
    </OnboardingStack.Navigator>
  );
};
