import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import {
  BillActionStatusEnum as BillActionStatusEnumSchema,
  BillActionStatusList as BillActionStatusListSchema,
  PaginatedBillActionStatusList as PaginatedBillActionStatusListSchema,
} from '@/lib/zod';
import { FetchOptions } from '@/types';

export type BillActionStatus = z.infer<typeof BillActionStatusEnumSchema>;
export type BillActionStatusItem = z.infer<typeof BillActionStatusListSchema>;
export type PaginatedBillActionStatusList = z.infer<
  typeof PaginatedBillActionStatusListSchema
>;

export const getUserActionsByStatus = async ({
  search,
  pageParam,
  status,
}: FetchOptions & { status: BillActionStatus }) => {
  const response = await apiClient.get(
    `/bills/actions/status/?status=${status}&search=${search}&page=${pageParam}`,
  );
  return response.data as PaginatedBillActionStatusList;
};

export const useUserActionsByStatus = (
  search: string,
  status: BillActionStatus,
) => {
  return useInfiniteQuery({
    queryKey: [...allStaticQueryKeys.getUserActions, search, status],
    queryFn: ({ pageParam = 1 }) =>
      getUserActionsByStatus({ search, pageParam, status }),
    getNextPageParam: (lastPage, _pages) => lastPage.next,
  });
};
