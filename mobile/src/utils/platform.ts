import { Platform } from 'react-native';

/**
 * Returns true if the app is running on Android, false otherwise.
 */
export const isAndroid = (): boolean => Platform.OS === 'android';

/**
 * Returns true if the app is running on iOS, false otherwise.
 */
export const isIOS = (): boolean => Platform.OS === 'ios';
