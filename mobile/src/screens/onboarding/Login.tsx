import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface LoginProps {}

export const Login: React.FunctionComponent<LoginProps> = () => {
  return (
    <SafeAreaView>
      <Text>This is the login</Text>
    </SafeAreaView>
  );
};
