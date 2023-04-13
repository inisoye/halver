import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface BillsProps {}

export const Bills: React.FunctionComponent<BillsProps> = () => {
  return (
    <SafeAreaView>
      <Text>This is the bills</Text>
    </SafeAreaView>
  );
};
