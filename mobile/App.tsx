import { StatusBar } from "expo-status-bar";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "./src/navigation";


export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="auto" />
      <NavigationContainer />
    </SafeAreaProvider>
  );
}
