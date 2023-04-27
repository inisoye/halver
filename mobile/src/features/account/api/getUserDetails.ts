import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { CustomUserDetails as UserDetailsSchema } from '@/lib/zod';

export type UserDetails = z.infer<typeof UserDetailsSchema>;

export const getUserDetails = async () => {
  const response = await apiClient.get(`/api/v1/dj-rest-auth/user`);
  return UserDetailsSchema.parse(response.data);
};

export const useUserDetails = () => {
  return useQuery({
    queryKey: ['user-details'],
    queryFn: getUserDetails,
  });
};
