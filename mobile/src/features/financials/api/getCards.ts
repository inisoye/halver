import { useQuery, type QueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { PaginatedUserCardList as CardsListSchema } from '@/lib/zod';

export type CardsList = z.infer<typeof CardsListSchema>;

export const getCards = async () => {
  const response = await apiClient.get<CardsList>('/financials/user-cards/');
  return response.data; // Not parsed as it can be a large dataset.
};

export const useCards = () => {
  return useQuery({
    queryKey: allStaticQueryKeys.getCards,
    queryFn: getCards,
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });
};

export const prefetchCards = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: allStaticQueryKeys.getCards,
    queryFn: getCards,
  });
};
