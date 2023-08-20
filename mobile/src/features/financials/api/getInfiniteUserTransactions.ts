import { useInfiniteQuery } from '@tanstack/react-query';

import { BillTransactionList } from '@/features/bills';
import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { FetchOptions } from '@/types';

export const getInfiniteUserTransactions = async ({
  search,
  pageParam,
}: FetchOptions) => {
  const response = await apiClient.get(
    `/bills/user-transactions/?search=${search}&page=${pageParam}`,
  );
  return response.data as BillTransactionList;
};

export const useInfiniteUserTransactions = (search: string) => {
  return useInfiniteQuery({
    queryKey: [...allStaticQueryKeys.getUserTransactions, search],
    queryFn: ({ pageParam = 1 }) => getInfiniteUserTransactions({ search, pageParam }),
    getNextPageParam: (lastPage, _pages) => lastPage.next,
  });
};
