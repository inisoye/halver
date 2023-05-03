import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allQueryKeys } from '@/lib/react-query';
import {
  PatchedCustomUserDetails as PatchedUserDetailsSchema,
  CustomUserDetails as UserDetailsSchema,
} from '@/lib/zod';

export type UpdateUserDetailsPayload = z.infer<typeof PatchedUserDetailsSchema>;

export const updateSingleUserDetail = async (updateUserDetailsDto: UpdateUserDetailsPayload) => {
  const response = await apiClient.patch('/api/v1/dj-rest-auth/user/', updateUserDetailsDto);
  return UserDetailsSchema.parse(response.data);
};

export const useUpdateSingleUserDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSingleUserDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allQueryKeys.getUserDetails });
    },
  });
};
