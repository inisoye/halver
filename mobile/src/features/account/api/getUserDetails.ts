import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { z } from 'zod';

import { apiClient, deleteAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys, storage } from '@/lib/mmkv';
import { allStaticQueryKeys } from '@/lib/react-query';
import { CustomUserDetails as UserDetailsSchema } from '@/lib/zod';
import { formatAxiosErrorMessage } from '@/utils';

export type UserDetails = z.infer<typeof UserDetailsSchema>;

export const getUserDetails = async () => {
  const response = await apiClient.get('/api/v1/dj-rest-auth/user/');
  return UserDetailsSchema.parse(response.data);
};

const THROW_OUT_STATUS_CODES = [401, 403];

export const useUserDetails = () => {
  const [token, setToken] = useMMKVString(allMMKVKeys.token);

  return useQuery({
    queryKey: allStaticQueryKeys.getUserDetails,
    queryFn: getUserDetails,
    enabled: !!token,
    onError: (error: AxiosError) => {
      if (error.response && THROW_OUT_STATUS_CODES.includes(error.response?.status)) {
        setToken(undefined);
        storage.clearAll();
        deleteAxiosDefaultToken();

        const errorMessage = formatAxiosErrorMessage(error);
        Alert.alert(
          'Error',
          `Your account details could not be obtained. ${errorMessage}`,
          [
            {
              text: 'OK',
              style: 'default',
            },
          ],
        );
      }
    },
  });
};
