import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as React from 'react';

import { navigateWithoutNavigationProp } from '@/lib/react-navigation';
import { isAndroid } from '@/utils';

import { useAreNotificationsEnabled } from './useAreNotificationsEnabled';

/**
 * Asynchronously registers the application for push notifications and retrieves the device's push token.
 * This function also sets a notification channel on Android if the device is running Android.
 *
 * @returns A promise that resolves to the push token if successful, or undefined if there was an issue.
 */
async function registerForPushNotificationsAsync() {
  let token: string | undefined;

  if (isAndroid()) {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null; // Add notification here: 'Failed to get push token for push notification!'
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })
    ).data;
  }

  return token;
}

/**
 * Set up push notifications in the application by obtaining and returning the Expo Push Token.
 *
 * @returns An object containing the expoPushToken and notification state.
 */
export const useNotificationsSetup = () => {
  const { data: areNotificationsEnabled } = useAreNotificationsEnabled();

  const [expoPushToken, setExpoPushToken] = React.useState<
    string | undefined | null
  >(undefined);
  const [notification, setNotification] = React.useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = React.useRef<
    Notifications.Subscription | undefined
  >();
  const responseListener = React.useRef<
    Notifications.Subscription | undefined
  >();

  const registerAndSetToken = React.useCallback(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  React.useEffect(() => {
    registerAndSetToken();

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notificationResponse => {
        setNotification(notificationResponse);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        const { bill_name: billName, bill_id: billId } =
          response?.notification.request.content.data ?? {};

        // If the notification payload contains bill data, redirect the user there.
        if (
          billName &&
          billId &&
          response?.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
          navigateWithoutNavigationProp('Bill', {
            id: billId,
            name: billName,
            shouldUpdate: true,
          });
        }
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [registerAndSetToken, areNotificationsEnabled]);

  return {
    expoPushToken,
    notification,
    registerAndSetToken,
  };
};
