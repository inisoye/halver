import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { PaystackBanksList as BanksListSchema } from '@/lib/zod';

export type BanksList = z.infer<typeof BanksListSchema>;

export const getBanks = async () => {
  const response = await apiClient.get<BanksList>('/financials/banks/');
  return response.data; // Not parsed as it is a large dataset.
};

export const useBanks = () => {
  return useQuery({
    queryKey: allStaticQueryKeys.getBanks,
    queryFn: getBanks,
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });
};
