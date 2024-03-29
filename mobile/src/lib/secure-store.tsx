import * as SecureStore from 'expo-secure-store';

interface SecureStoreOptions {
  authenticationPrompt?: string;
  keychainAccessible?: SecureStore.KeychainAccessibilityConstant;
  keychainService?: string;
  requireAuthentication?: boolean;
}

export async function saveToSecureStore(
  key: string,
  value: string,
  options?: SecureStoreOptions,
): Promise<void> {
  await SecureStore.setItemAsync(key, value, options);
}

export async function getFromSecureStore(
  key: string,
  options?: SecureStoreOptions,
): Promise<string | null> {
  return await SecureStore.getItemAsync(key, options);
}

export const allSecureStoreKeys = {
  appleFamilyName: 'APPLE_FAMILY_NAME',
  appleGivenName: 'APPLE_GIVEN_NAME',
  isFirstTime: 'IS_FIRST_TIME',
};
