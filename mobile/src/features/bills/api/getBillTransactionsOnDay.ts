import { useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import type { FetchOptions } from '@/types';

import { BillTransactionList } from './getBillTransactions';

export const getBillTransactionsOnDay = async (
  id: string,
  day: string,
  { pageParam }: FetchOptions,
) => {
  const response = await apiClient.get(
    `/bills/${id}/transactions/day/?day=${day}&page=${pageParam}`,
  );
  return response.data as BillTransactionList;
};

export const useBillTransactionsOnDay = (
  id: string,
  day: string,
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: [id, ...allStaticQueryKeys.getBillTransactionsOnDay, day],
    queryFn: ({ pageParam = 1 }) =>
      getBillTransactionsOnDay(id, day, { pageParam }),
    getNextPageParam: (lastPage, _pages) => lastPage.next,
    enabled,
  });
};
