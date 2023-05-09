import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { UserCardAdditionResponse as UserCardAdditionResponseSchema } from '@/lib/zod';

export const getCardAdditionURL = async () => {
  const response = await apiClient.get('/api/v1/financials/user-cards/initialize-card-addition/');
  return UserCardAdditionResponseSchema.parse(response.data);
};

export const useGetCardAdditionURL = () => {
  return useQuery({
    queryKey: allStaticQueryKeys.getCardAdditionURL,
    queryFn: getCardAdditionURL,
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });
};
