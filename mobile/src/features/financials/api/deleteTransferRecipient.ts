import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const deleteTransferRecipient = async (recipientCode: string) => {
  const response = await apiClient.delete(
    `/financials/transfer-recipients/${recipientCode}/`,
  );
  return response.data;
};

export const useDeleteTransferRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransferRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getUserDetails });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getTransferRecipients,
      });
    },
  });
};
