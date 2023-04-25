import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { NativeWindStyleSheet } from 'nativewind';
import * as React from 'react';

import { Providers } from '@/providers';

import { NavigationContainer } from './src/navigation';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Halver-Naira': require('./assets/fonts/HalverNairaMedium.otf'),
    'Halver-Medium': require('./assets/fonts/HalverSansMedium.otf'),
    'Halver-Semibold': require('./assets/fonts/HalverSansSemibold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <StatusBar style="auto" />

      <NavigationContainer />
    </Providers>
  );
}
