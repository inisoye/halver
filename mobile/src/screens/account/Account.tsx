import * as React from "react";
import { Text, View } from "react-native";


interface AccountProps {}

export const Account: React.FunctionComponent<AccountProps> = () => {
  return (
    <View>
      <Text>This is the account</Text>
    </View>
  );
};
