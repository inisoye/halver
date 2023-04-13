import * as React from "react";
import { SafeAreaView as ReactNativeSafeAreaView } from "react-native-safe-area-context";


interface SafeAreaViewProps {
  children: React.ReactNode;
}

export const SafeAreaView: React.FunctionComponent<SafeAreaViewProps> = ({
  children,
}) => {
  return <ReactNativeSafeAreaView>{children}</ReactNativeSafeAreaView>;
};
