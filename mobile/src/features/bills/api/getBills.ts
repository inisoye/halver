import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import {
  BillList as BillListSchema,
  PaginatedBillList as PaginatedBillListSchema,
} from '@/lib/zod';

export type BillListItem = z.infer<typeof BillListSchema>;
export type PaginatedBillList = z.infer<typeof PaginatedBillListSchema>;

export const getBills = async () => {
  const response = await apiClient.get('/bills/');
  return response.data as PaginatedBillList;
};

export const useBills = () => {
  return useQuery({
    queryKey: allStaticQueryKeys.getBills,
    queryFn: getBills,
  });
};
