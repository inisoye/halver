import { useFlipper } from '@react-navigation/devtools';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer as RNNavigationContainer,
} from '@react-navigation/native';
import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { Box } from '@/components';
import {
  checkIfUserDetailsAreIncomplete,
  useUserDetails,
} from '@/features/account';
import { useFullScreenLoader, useIsFirstTime } from '@/hooks';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { navigationRef } from '@/lib/react-navigation';
import {
  LoginStackNavigator,
  OnboardingStackNavigator,
} from '@/navigation/stacks';
import { useIsDarkModeSelected } from '@/utils';

import { AppRootStackNavigator } from './AppRootStackNavigator';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token] = useMMKVString(allMMKVKeys.token);
  const [isFirstTime] = useIsFirstTime();

  const { data: userDetails, isLoading, isFetching } = useUserDetails();
  const isDarkMode = useIsDarkModeSelected();

  useFlipper(navigationRef);

  React.useEffect(() => {
    if (token) {
      setAxiosDefaultToken(token, apiClient);
    }
  }, [token]);

  const areUserDetailsLoading = isLoading && isFetching;
  const isPhoneNumberMissing = !userDetails?.phone;
  const areUserDetailsIncomplete = checkIfUserDetailsAreIncomplete(userDetails);

  useFullScreenLoader({
    isLoading: areUserDetailsLoading,
    message: 'Gathering your details...',
  });

  return (
    <Box backgroundColor="background" flex={1}>
      <RNNavigationContainer
        ref={navigationRef}
        theme={isDarkMode ? DarkTheme : DefaultTheme}
      >
        {!token ? (
          <LoginStackNavigator />
        ) : (!isLoading && isPhoneNumberMissing) ||
          (isFirstTime && areUserDetailsIncomplete === true) ? (
          <OnboardingStackNavigator />
        ) : (
          <AppRootStackNavigator />
        )}
      </RNNavigationContainer>
    </Box>
  );
};
