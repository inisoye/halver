import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { z } from 'zod';

import { useNotificationsSetup } from '@/hooks';
import { apiClient } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { allStaticQueryKeys } from '@/lib/react-query';
import { PatchedExpoPushToken as PatchedExpoPushTokenSchema } from '@/lib/zod';

export type ExpoPushTokenUpdatePayload = z.infer<
  typeof PatchedExpoPushTokenSchema
>;

export const updateExpoPushToken = async (
  expoPushTokenUpdateDto: ExpoPushTokenUpdatePayload,
) => {
  const response = await apiClient.patch(
    'accounts/expo-push-token/',
    expoPushTokenUpdateDto,
  );
  return response.data;
};

export const useUpdateExpoPushToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpoPushToken,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getUserDetails,
      });
    },
  });
};

/**
 * Obtains the Expo Push Token and sends it to the backend if the user is authenticated.
 */
export const useStoreExpoPushToken = () => {
  const [token] = useMMKVString(allMMKVKeys.token);

  const { expoPushToken, registerAndSetToken } = useNotificationsSetup();

  const { mutate: storeExpoPushToken } = useUpdateExpoPushToken();

  // Post token to backend only when user is authenticated and the token already exists.
  React.useEffect(() => {
    if (
      expoPushToken &&
      !!apiClient.defaults.headers.common.Authorization &&
      token
    ) {
      storeExpoPushToken({ expoPushToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expoPushToken, apiClient.defaults.headers.common.Authorization, token]);

  return { expoPushToken, registerAndSetToken };
};
