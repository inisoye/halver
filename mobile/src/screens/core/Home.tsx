import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface HomeProps {}

export const Home: React.FunctionComponent<HomeProps> = () => {
  return (
    <SafeAreaView>
      <Text>This is the home</Text>
    </SafeAreaView>
  );
};
