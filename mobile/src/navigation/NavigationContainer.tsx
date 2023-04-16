import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer as RNNavigationContainer,
} from '@react-navigation/native';
import * as React from 'react';
import { useColorScheme } from 'react-native';

import { BottomTabNavigator } from './BottomTabNavigator';
import { OnboardingStackNavigator } from './stacks';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token] = React.useState(true);
  const scheme = useColorScheme();

  return (
    <RNNavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!token ? <OnboardingStackNavigator /> : <BottomTabNavigator />}
    </RNNavigationContainer>
  );
};
