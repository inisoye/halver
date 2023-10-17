import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import {
  PaginatedBillDailyContributionList as BillDailyContributionListSchema,
  BillDailyContribution as BillDailyContributionSchema,
} from '@/lib/zod';
import type { FetchOptions } from '@/types';

export type BillDailyContribution = z.infer<typeof BillDailyContributionSchema>;
export type BillDailyContributionList = z.infer<
  typeof BillDailyContributionListSchema
>;

export const getBillContributionsByDay = async (
  id: string,
  { pageParam }: FetchOptions,
) => {
  const response = await apiClient.get(
    `/bills/${id}/transactions/contributions/?page=${pageParam}`,
  );
  return response.data as BillDailyContributionList;
};

export const useBillContributionsByDay = (id: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: [...allStaticQueryKeys.getBillContributionsByDay, id],
    queryFn: ({ pageParam = 1 }) =>
      getBillContributionsByDay(id, { pageParam }),
    getNextPageParam: (lastPage, _pages) => lastPage.next,
    enabled,
  });
};
