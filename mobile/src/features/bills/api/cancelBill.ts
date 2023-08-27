import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const cancelBill = async ({ id }: { id: string }) => {
  const response = await apiClient.patch(`/bills/${id}/cancel/`);
  return response.data;
};

export const useCancelBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getBill });
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getBills });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getActionStatusCounts,
      });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getUserActions,
      });
    },
  });
};
