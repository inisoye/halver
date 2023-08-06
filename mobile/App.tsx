import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin';
import * as Sentry from 'sentry-expo';

import { storage } from '@/lib/mmkv';
import { NavigationContainer } from '@/navigation';
import { Providers } from '@/providers';
import { IS_DEV, IS_DEV_OR_PREVIEW } from '@/utils';

if (__DEV__ || IS_DEV) {
  initializeMMKVFlipper({ default: storage });
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: IS_DEV_OR_PREVIEW, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
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
