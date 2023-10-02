import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
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
