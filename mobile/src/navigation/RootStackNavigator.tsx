import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import {
  BottomTabNavigator,
  NavigationContainer,
  OnboardingStackNavigator
} from "@/navigation";


const RootStack = createNativeStackNavigator();

export const Root = () => {
  const [token] = React.useState(false);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
      }}
    >
      {token ? (
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingStackNavigator}
        />
      ) : (
        <RootStack.Screen name="App" component={BottomTabNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export const RootStackNavigator = () => (
  <NavigationContainer>
    <Root />
  </NavigationContainer>
);
