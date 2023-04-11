import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { NativeWindStyleSheet } from "nativewind";
import { View } from "react-native";

import { RootStackNavigator } from "@/navigation";


NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-[#EE8A79]">
      <RootStackNavigator />
      <StatusBar style="auto" />
    </View>
  );
}

registerRootComponent(App);
