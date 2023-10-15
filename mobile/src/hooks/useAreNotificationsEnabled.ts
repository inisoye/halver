import { useQuery } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { allStaticQueryKeys } from '@/lib/react-query';

export async function checkIfNotificationsEnabled() {
  const settings = await Notifications.getPermissionsAsync();

  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
  );
}

export function useAreNotificationsEnabled() {
  return useQuery({
    queryKey: allStaticQueryKeys.checkIfNotificationsEnabled,
    queryFn: checkIfNotificationsEnabled,
    cacheTime: 0, // 15 mins
    staleTime: 0, // 15 mins
  });
}
