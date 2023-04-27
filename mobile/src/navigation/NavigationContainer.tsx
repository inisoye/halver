import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer as RNNavigationContainer,
} from '@react-navigation/native';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import * as React from 'react';
import { useColorScheme } from 'react-native';

import { getUserDetailsStatus, tokenAtom, useUserDetails } from '@/features/account';

import { AppRootStackNavigator } from './AppRootStackNavigator';
import { LoginStackNavigator, OnboardingStackNavigator } from './stacks';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token, setToken] = useAtom(tokenAtom);
  const scheme = useColorScheme();
  const { data: userDetails } = useUserDetails();

  const userDetailsStatus = getUserDetailsStatus(token, userDetails);
  const areUserDetailsIncomplete = userDetailsStatus !== 'Details complete';

  console.log(userDetailsStatus);

  // React.useEffect(() => {
  //   setToken(RESET);
  // }, []);

  return (
    <RNNavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!token ? (
        <LoginStackNavigator />
      ) : areUserDetailsIncomplete ? (
        <OnboardingStackNavigator userDetailsStatus={userDetailsStatus} />
      ) : (
        <AppRootStackNavigator />
      )}
    </RNNavigationContainer>
  );
};
