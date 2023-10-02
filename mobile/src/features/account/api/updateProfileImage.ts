import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const updateProfileImage = async (updateProfileImageDto: FormData) => {
  const response = await apiClient.patch(
    '/accounts/profile-image/',
    updateProfileImageDto,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getUserDetails,
      });
    },
  });
};
