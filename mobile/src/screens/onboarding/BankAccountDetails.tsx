import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface BankAccountDetailsProps {}

export const BankAccountDetails: React.FunctionComponent<
  BankAccountDetailsProps
> = () => {
  return (
    <SafeAreaView>
      <Text>This is bank account details</Text>
    </SafeAreaView>
  );
};
