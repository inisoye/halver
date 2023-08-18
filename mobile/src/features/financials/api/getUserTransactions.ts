import { useQuery } from '@tanstack/react-query';

import { BillTransactionList } from '@/features/bills';
import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

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
