import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allQueryKeys } from '@/lib/react-query';
import { PaystackBanksList as BanksListSchema } from '@/lib/zod';

export type BanksList = z.infer<typeof BanksListSchema>;

export const getBanks = async () => {
  const response = await apiClient.get<BanksList>('/api/v1/financials/banks/');
  // Not parsed as it is a large dataset.
  return response.data;
};

export const useBanks = () => {
  return useQuery({
    queryKey: allQueryKeys.getBanks,
    queryFn: getBanks,
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });
};
