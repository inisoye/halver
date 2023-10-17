import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const cancelBillSubcscription = async ({ id }: { id: string }) => {
  const response = await apiClient.patch(
    `/bills/actions/${id}/subscription/cancel/`,
  );
  return response.data;
};

export const useCancelBillSubcscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBillSubcscription,
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
