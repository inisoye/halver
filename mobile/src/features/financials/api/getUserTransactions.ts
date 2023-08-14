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

export const getUserTransactions = async () => {
  const response = await apiClient.get('/bills/user-transactions/');
  return response.data as BillTransactionList;
};

export const useUserTransactions = () => {
  return useQuery({
    queryKey: allStaticQueryKeys.getUserTransactions,
    queryFn: getUserTransactions,
  });
};
