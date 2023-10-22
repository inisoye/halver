import * as LocalAuthentication from 'expo-local-authentication';
import { Appearance, Linking, Platform, useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { allMMKVKeys, storage } from '@/lib/mmkv';

export const isAndroid = (): boolean => Platform.OS === 'android';

export const isIOS = (): boolean => Platform.OS === 'ios';

export const isWeb = (): boolean => Platform.OS === 'web';

export const isDarkMode = (): boolean => {
  const displayMode = storage.getString(allMMKVKeys.displayMode) ?? 'system';

  const colorScheme = Appearance.getColorScheme();
  const isSystemDarkMode = displayMode === 'system' && colorScheme === 'dark';

  return displayMode === 'dark' || isSystemDarkMode;
};

export const useIsDarkModeSelected = () => {
  const [displayMode = 'system'] = useMMKVString(allMMKVKeys.displayMode);

  const colorScheme = useColorScheme();
  const isSystemDarkMode = displayMode === 'system' && colorScheme === 'dark';

  return displayMode === 'dark' || isSystemDarkMode;
};

/**
 * Opens the app settings on the device, allowing the user to configure app-specific settings.
 * On iOS, it uses the 'app-settings:' URL to open the settings. On Android, it opens the general device settings.
 */
export const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

/**
 * Performs biometric authentication using the device's biometric sensor, if available.
 * @returns A Promise that resolves to `true` if authentication is successful,
 * or `false` if it fails or if biometric authentication is not available.
 */
export const handleBiometricAuthentication = async (
  options?: LocalAuthentication.LocalAuthenticationOptions,
) => {
  const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

  if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
    return true;
  }

  const authenticationResult = await LocalAuthentication.authenticateAsync(
    options,
  );

  if (authenticationResult.success) {
    return true;
  } else {
    return false;
  }
};
