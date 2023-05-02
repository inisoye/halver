import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allQueryKeys } from '@/lib/react-query';
import { PatchedCustomUserDetails } from '@/lib/zod';

export type UpdateUserDetailsPayload = z.infer<typeof PatchedCustomUserDetails>;

export const updateUserDetails = async (updateUserDetailsDto: UpdateUserDetailsPayload) => {
  const response = await apiClient.put('/api/v1/dj-rest-auth/user/', updateUserDetailsDto);
  return response.data;
};

export const useUpdateUserDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allQueryKeys.getUserDetails });
    },
  });
};
