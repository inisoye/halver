import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { z } from 'zod';

import {
  apiClient,
  deleteAxiosDefaultToken,
  isAPIClientTokenSet,
} from '@/lib/axios';
import { allMMKVKeys, storage } from '@/lib/mmkv';
import { allStaticQueryKeys } from '@/lib/react-query';
import { CustomUserDetails as UserDetailsSchema } from '@/lib/zod';
import { formatAxiosErrorMessage } from '@/utils';

export type UserDetails = z.infer<typeof UserDetailsSchema>;

export const getUserDetails = async () => {
  const response = await apiClient.get('/dj-rest-auth/user/');
  return UserDetailsSchema.parse(response.data);
};

const THROW_OUT_STATUS_CODES = [401, 403];

export const useUserDetails = () => {
  const [token, setToken] = useMMKVString(allMMKVKeys.token);
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: allStaticQueryKeys.getUserDetails,
    queryFn: getUserDetails,
    enabled: !!token && isAPIClientTokenSet(),
    onError: (error: AxiosError) => {
      if (
        error.response &&
        THROW_OUT_STATUS_CODES.includes(error.response?.status)
      ) {
        queryClient.clear();
        deleteAxiosDefaultToken(apiClient);
        storage.clearAll();
        setToken(undefined);

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
    cacheTime: 60 * (60 * 1000), // 60 mins
  });
};
