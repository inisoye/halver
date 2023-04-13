import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface TransactionsProps {}

export const Transactions: React.FunctionComponent<TransactionsProps> = () => {
  return (
    <SafeAreaView>
      <Text>This is the transactions</Text>
    </SafeAreaView>
  );
};
