import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const setDefaultCard = async (id: string) => {
  const response = await apiClient.patch(`/financials/default-card/${id}/`);
  return response.data;
};

export const useSetDefaultCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getUserDetails,
      });
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getCards });
    },
  });
};
