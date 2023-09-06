import { useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { FetchOptions } from '@/types';

import { BillTransactionList } from './getBillTransactions';

export const getInfiniteBillTransactions = async (
  id: string,
  { search, pageParam }: FetchOptions,
) => {
  const response = await apiClient.get(
    `/bills/${id}/transactions/?search=${search}&page=${pageParam}`,
  );
  return response.data as BillTransactionList;
};

export const useInfiniteBillTransactions = (id: string, search = '') => {
  return useInfiniteQuery({
    queryKey: [...allStaticQueryKeys.getBillTransactions, id, search],
    queryFn: ({ pageParam = 1 }) =>
      getInfiniteBillTransactions(id, { search, pageParam }),
    getNextPageParam: (lastPage, _pages) => lastPage.next,
  });
};
