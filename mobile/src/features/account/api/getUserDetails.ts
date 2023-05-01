import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { storage } from '@/lib/mmkv';
import { CustomUserDetails as UserDetailsSchema } from '@/lib/zod';
import { formatAxiosErrorMessage } from '@/utils';

export type UserDetails = z.infer<typeof UserDetailsSchema>;

export const getUserDetails = async () => {
  const response = await apiClient.get(`/api/v1/dj-rest-auth/user/`);
  return UserDetailsSchema.parse(response.data);
};

export const GET_USER_DETAILS_QUERY_KEY = ['user-details'];

export const useUserDetails = () => {
  const [token, setToken] = useMMKVString('user.token');

  return useQuery({
    queryKey: GET_USER_DETAILS_QUERY_KEY,
    queryFn: getUserDetails,
    enabled: !!token,
    onError: error => {
      // setToken(RESET);
      setToken(undefined);
      storage.clearAll();

      const errorMessage = formatAxiosErrorMessage(error as AxiosError);
      Alert.alert('Error', `Your account details could not be obtained. ${errorMessage}`, [
        {
          text: 'OK',
          style: 'default',
        },
      ]);
    },
  });
};
