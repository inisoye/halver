import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import {
  BillList as BillListSchema,
  PaginatedBillList as PaginatedBillListSchema,
} from '@/lib/zod';
import { FetchOptions } from '@/types';

export type BillListItem = z.infer<typeof BillListSchema>;
export type PaginatedBillList = z.infer<typeof PaginatedBillListSchema>;

export const getBills = async ({ search, pageParam }: FetchOptions) => {
  const response = await apiClient.get(`/bills/?search=${search}&page=${pageParam}`);
  return response.data as PaginatedBillList;
};

export const useBills = (search: string) => {
  return useInfiniteQuery({
    queryKey: [...allStaticQueryKeys.getBills, search],
    queryFn: ({ pageParam = 1 }) => getBills({ search, pageParam }),
    getNextPageParam: (lastPage, _pages) => lastPage.next,
  });
};
