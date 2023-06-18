import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin';

import { storage } from '@/lib/mmkv';
import { NavigationContainer } from '@/navigation';
import { Providers } from '@/providers';

if (__DEV__) {
  initializeMMKVFlipper({ default: storage });
}

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
