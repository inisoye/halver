import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface AccountProps {}

export const Account: React.FunctionComponent<AccountProps> = () => {
  return (
    <SafeAreaView>
      <Text>This is the account</Text>
    </SafeAreaView>
  );
};
