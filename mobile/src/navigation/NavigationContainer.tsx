import { useFlipper } from '@react-navigation/devtools';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer as RNNavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { getUserDetailsStatus, useUserDetails } from '@/features/account';
import { useFullScreenLoader } from '@/hooks';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';

import { AppRootStackNavigator } from './AppRootStackNavigator';
import { LoginStackNavigator, OnboardingStackNavigator } from './stacks';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token] = useMMKVString('user.token');
  const scheme = useColorScheme();
  const { data: userDetails, isLoading, isFetching } = useUserDetails();

  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);

  const userDetailsStatus = getUserDetailsStatus(token, userDetails);
  const areUserDetailsIncomplete = userDetailsStatus !== 'Details complete';

  React.useEffect(() => {
    if (token) {
      setAxiosDefaultToken(token, apiClient);
    }
  }, [token]);

  const areUserDetailsLoading = isLoading && isFetching;

  useFullScreenLoader({ isLoading: areUserDetailsLoading, message: 'Gathering your details...' });

  return (
    <>
      <RNNavigationContainer
        ref={navigationRef}
        theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        {!token ? (
          <LoginStackNavigator />
        ) : areUserDetailsIncomplete ? (
          <OnboardingStackNavigator userDetailsStatus={userDetailsStatus} />
        ) : (
          <AppRootStackNavigator />
        )}
      </RNNavigationContainer>
    </>
  );
};
