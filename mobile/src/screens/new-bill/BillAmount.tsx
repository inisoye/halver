import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface BillAmountProps {}

export const BillAmount: React.FunctionComponent<BillAmountProps> = () => {
  return (
    <SafeAreaView>
      <Text>This is bill amount</Text>
    </SafeAreaView>
  );
};
