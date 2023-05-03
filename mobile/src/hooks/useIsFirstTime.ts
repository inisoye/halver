import { useMMKVBoolean } from 'react-native-mmkv';

import { allMMKVKeys } from '@/lib/mmkv';

export const useIsFirstTime = () => {
  const [isFirstTime, setIsFirstTime] = useMMKVBoolean(allMMKVKeys.isFirstTime);

  if (isFirstTime === undefined) {
    return [true, setIsFirstTime] as const;
  }

  return [isFirstTime, setIsFirstTime] as const;
};
