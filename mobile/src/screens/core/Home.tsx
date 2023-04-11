import * as React from "react";
import { Text, View } from "react-native";


interface HomeProps {}

export const Home: React.FunctionComponent<HomeProps> = () => {
  return (
    <View>
      <Text>This is the home</Text>
    </View>
  );
};
