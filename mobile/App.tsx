import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin';

import { Box } from '@/components';
import { useUserDetails } from '@/features/account';
import { storage } from '@/lib/mmkv';
import { NavigationContainer } from '@/navigation';
import { Providers } from '@/providers';
import { useIsDarkModeSelected } from '@/utils';

if (__DEV__) {
  initializeMMKVFlipper({ default: storage });
}

SplashScreen.preventAutoHideAsync();

function MainContent() {
  const { isLoading: areUserDetailsLoading } = useUserDetails();

  const onLayoutRootView = React.useCallback(async () => {
    if (!areUserDetailsLoading) {
      await SplashScreen.hideAsync();
    }
  }, [areUserDetailsLoading]);

  return (
    <Box flex={1} onLayout={onLayoutRootView}>
      <NavigationContainer />
    </Box>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Halver-Naira': require('./assets/fonts/HalverNairaMedium.otf'),
    'Halver-Medium': require('./assets/fonts/HalverSansMedium.otf'),
    'Halver-Semibold': require('./assets/fonts/HalverSansSemibold.otf'),
  });

  const isDarkMode = useIsDarkModeSelected();

  React.useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <MainContent />
    </Providers>
  );
}
