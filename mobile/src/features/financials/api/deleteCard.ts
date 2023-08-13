import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const deleteCard = async (id: string) => {
  const response = await apiClient.delete(`/financials/user-cards/${id}/`);
  return response.data;
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getUserDetails });
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getCards });
    },
  });
};
