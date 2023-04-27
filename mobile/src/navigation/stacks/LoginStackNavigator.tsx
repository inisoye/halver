import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Login } from '@/screens';

export type LoginStackParamList = {
  Login: undefined;
};

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export const LoginStackNavigator: React.FunctionComponent = () => {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        component={Login}
        name="Login"
        options={{
          headerShown: false,
        }}
      />
    </LoginStack.Navigator>
  );
};
