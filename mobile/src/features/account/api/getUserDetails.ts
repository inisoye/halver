import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { CustomUserDetails as UserDetailsSchema } from '@/lib/zod';

export const getUserDetails = async () => {
  const response = await apiClient.get(`/api/v1/dj-rest-auth/user`);
  console.log({ response: response.data });
  return UserDetailsSchema.parse(response.data);
};

export const useUserDetails = () => {
  return useQuery({
    queryKey: ['user-details'],
    queryFn: getUserDetails,
  });
};
