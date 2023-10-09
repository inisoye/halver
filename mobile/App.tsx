import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin';

import { Box } from '@/components';
import { useUpdateExpoPushToken, useUserDetails } from '@/features/account';
import { useNotificationsSetup } from '@/hooks';
import { apiClient } from '@/lib/axios';
import { allMMKVKeys, storage } from '@/lib/mmkv';
import { NavigationContainer } from '@/navigation';
import { Providers } from '@/providers';
import { useIsDarkModeSelected } from '@/utils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

if (__DEV__) {
  initializeMMKVFlipper({ default: storage });
}

SplashScreen.preventAutoHideAsync();

function MainContent() {
  const [token] = useMMKVString(allMMKVKeys.token);

  const { expoPushToken } = useNotificationsSetup();
  const { mutate: updateExpoPushToken } = useUpdateExpoPushToken();

  // Post token to backend only when user is authenticated and the token already exists.
  React.useEffect(() => {
    if (
      expoPushToken &&
      !!apiClient.defaults.headers.common.Authorization &&
      token
    ) {
      updateExpoPushToken({ expoPushToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expoPushToken, apiClient.defaults.headers.common.Authorization, token]);

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
