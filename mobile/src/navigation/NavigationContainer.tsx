import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer as RNNavigationContainer,
} from '@react-navigation/native';
import { useAtom } from 'jotai';
import * as React from 'react';
import { useColorScheme } from 'react-native';

import { tokenAtom, useUserDetails } from '@/features/account';

import { AppRootStackNavigator } from './AppRootStackNavigator';
import { OnboardingStackNavigator } from './stacks';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token] = useAtom(tokenAtom);
  const scheme = useColorScheme();
  const { data } = useUserDetails();

  return (
    <RNNavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {token ? <AppRootStackNavigator /> : <OnboardingStackNavigator />}
    </RNNavigationContainer>
  );
};
