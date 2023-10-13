import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const allMMKVKeys = {
  token: 'USER_TOKEN',
  isFirstTime: 'IS_FIRST_TIME',
  newBillPayload: 'NEW_BILL_PAYLOAD',
  registeredContacts: 'REGISTERED_CONTACTS',
  displayMode: 'DISPLAY_MODE',
  hasCompletedOnboarding: 'HAS_COMPLETED_ONBOARING',
};
