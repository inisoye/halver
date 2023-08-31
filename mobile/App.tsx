import { useFonts } from 'expo-font';
import * as Network from 'expo-network';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin';
import * as Sentry from 'sentry-expo';

import { storage } from '@/lib/mmkv';
import { NavigationContainer } from '@/navigation';
import { Providers } from '@/providers';
import { isIOS, useIsDarkModeSelected } from '@/utils';

if (__DEV__) {
  initializeMMKVFlipper({ default: storage });
}

const devServerPort = 8081;
let devServerIpAddress: string | null = null;
Network.getIpAddressAsync().then(ip => {
  devServerIpAddress = ip;
});

Sentry.init({
  dsn: 'https://e7b0a97ab743aeee4cc1527e3d0423a8@o4505161164980224.ingest.sentry.io/4505657064423424',
  enableInExpoDevelopment: isIOS(),
  debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      shouldCreateSpanForRequest: url => {
        return (
          !__DEV__ ||
          !url.startsWith(`http://${devServerIpAddress}:${devServerPort}/logs`)
        );
      },
    }),
  ],
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Halver-Naira': require('./assets/fonts/HalverNairaMedium.otf'),
    'Halver-Medium': require('./assets/fonts/HalverSansMedium.otf'),
    'Halver-Semibold': require('./assets/fonts/HalverSansSemibold.otf'),
  });

  const isDarkMode = useIsDarkModeSelected();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <NavigationContainer />
    </Providers>
  );
}
