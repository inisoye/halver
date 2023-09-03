import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import {
  PaginatedBillDailyContributionList as BillDailyContributionListSchema,
  BillDailyContribution as BillDailyContributionSchema,
} from '@/lib/zod';

export type BillDailyContribution = z.infer<typeof BillDailyContributionSchema>;
export type BillDailyContributionList = z.infer<typeof BillDailyContributionListSchema>;

export const getBillContributionsByDay = async (id: string) => {
  const response = await apiClient.get(`/bills/${id}/transactions/contributions/`);
  return response.data as BillDailyContributionList;
};

export const useBillContributionsByDay = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [id, allStaticQueryKeys.getBillContributionsByDay],
    queryFn: () => getBillContributionsByDay(id),
    enabled,
  });
};
