import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allQueryKeys } from '@/lib/react-query';
import { UserCardAdditionResponse as UserCardAdditionResponseSchema } from '@/lib/zod';

export const getCardAdditionURL = async () => {
  const response = await apiClient.get('/api/v1/financials/user-cards/initialize-card-addition/');
  return UserCardAdditionResponseSchema.parse(response.data);
};

export const useGetCardAdditionURL = () => {
  return useQuery({
    queryKey: allQueryKeys.getCardAdditionURL,
    queryFn: getCardAdditionURL,
  });
};
