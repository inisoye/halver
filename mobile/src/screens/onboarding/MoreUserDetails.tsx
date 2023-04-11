import * as React from "react";
import { Text, View } from "react-native";


interface MoreUserDetailsProps {}

export const MoreUserDetails: React.FunctionComponent<
  MoreUserDetailsProps
> = () => {
  return (
    <View>
      <Text>This is more user details</Text>
    </View>
  );
};
