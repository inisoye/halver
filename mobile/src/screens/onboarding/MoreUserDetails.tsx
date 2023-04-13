import * as React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "@/components";


interface MoreUserDetailsProps {}

export const MoreUserDetails: React.FunctionComponent<
  MoreUserDetailsProps
> = () => {
  return (
    <SafeAreaView>
      <Text>This is more user details</Text>
    </SafeAreaView>
  );
};
