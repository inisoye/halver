import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const setDefaultTransferRecipient = async (id: string) => {
  const response = await apiClient.patch(
    `/financials/default-transfer-recipient/${id}/`,
  );
  return response.data;
};

export const useSetDefaultTransferRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultTransferRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getUserDetails,
      });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getTransferRecipients,
      });
    },
  });
};
