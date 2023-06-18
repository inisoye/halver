import { useFlipper } from '@react-navigation/devtools';
import {
  NavigationContainer as RNNavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { checkIfUserDetailsAreIncomplete, useUserDetails } from '@/features/account';
import { useFullScreenLoader } from '@/hooks';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { LoginStackNavigator, OnboardingStackNavigator } from '@/navigation/stacks';

import { AppRootStackNavigator } from './AppRootStackNavigator';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token] = useMMKVString(allMMKVKeys.token);
  const { data: userDetails, isLoading, isFetching } = useUserDetails();

  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);

  React.useEffect(() => {
    if (token) {
      setAxiosDefaultToken(token, apiClient);
    }
  }, [token]);

  const areUserDetailsLoading = isLoading && isFetching;
  const areUserDetailsIncomplete = checkIfUserDetailsAreIncomplete(userDetails);

  useFullScreenLoader({
    isLoading: areUserDetailsLoading,
    message: 'Gathering your details...',
  });

  return (
    <>
      <RNNavigationContainer ref={navigationRef}>
        {!token || isLoading ? (
          <LoginStackNavigator />
        ) : areUserDetailsIncomplete ? (
          <OnboardingStackNavigator />
        ) : (
          <AppRootStackNavigator />
        )}
      </RNNavigationContainer>
    </>
  );
};
