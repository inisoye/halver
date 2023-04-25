import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer as RNNavigationContainer,
} from '@react-navigation/native';
import * as React from 'react';
import { useColorScheme } from 'react-native';

import { AppRootStackNavigator } from './AppRootStackNavigator';
import { OnboardingStackNavigator } from './stacks';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token] = React.useState(false);
  const scheme = useColorScheme();

  return (
    <RNNavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!token ? <OnboardingStackNavigator /> : <AppRootStackNavigator />}
    </RNNavigationContainer>
  );
};
