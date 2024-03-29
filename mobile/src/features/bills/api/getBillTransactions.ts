import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import {
  PaginatedBillTransactionList as BillTransactionListSchema,
  BillTransaction as BillTransactionSchema,
} from '@/lib/zod';

export type BillTransaction = z.infer<typeof BillTransactionSchema>;
export type BillTransactionList = z.infer<typeof BillTransactionListSchema>;

export const getBillTransactions = async (id: string) => {
  const response = await apiClient.get(`/bills/${id}/transactions/`);
  return response.data as BillTransactionList;
};

export const useBillTransactions = (id: string) => {
  return useQuery({
    queryKey: [...allStaticQueryKeys.getBillTransactions, id],
    queryFn: () => getBillTransactions(id),
  });
};
