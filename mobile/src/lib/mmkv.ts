import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const allMMKVKeys = {
  token: 'USER_TOKEN',
  isFirstTime: 'IS_FIRST_TIME',
};