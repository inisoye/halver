import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import * as React from 'react';

import { BottomTabNavigator } from './BottomTabNavigator';
import { OnboardingStackNavigator } from './stacks';

export const NavigationContainer: React.FunctionComponent = () => {
  const [token] = React.useState(true);

  return (
    <RNNavigationContainer>
      {!token ? <OnboardingStackNavigator /> : <BottomTabNavigator />}
    </RNNavigationContainer>
  );
};
