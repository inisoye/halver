import { useQuery, type QueryClient } from '@tanstack/react-query';

import { apiClient, isAPIClientTokenSet } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { BillActionStatusCountList } from '@/lib/zod';

export const getActionStatusCounts = async () => {
  const response = await apiClient.get('/bills/actions/status-counts/');
  return BillActionStatusCountList.parse(response.data);
};

export const useActionStatusCounts = () => {
  return useQuery({
    queryKey: allStaticQueryKeys.getActionStatusCounts,
    queryFn: getActionStatusCounts,
    enabled: isAPIClientTokenSet(),
  });
};

export const prefetchActionStatusCounts = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: allStaticQueryKeys.getActionStatusCounts,
    queryFn: getActionStatusCounts,
  });
};
