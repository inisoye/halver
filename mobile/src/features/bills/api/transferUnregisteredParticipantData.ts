import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';

export const transferUnregisteredParticipantData = async () => {
  const response = await apiClient.post('/bills/unregistered-participants/transfer/');
  return response.data;
};

export const useTransferUnregisteredParticipantData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferUnregisteredParticipantData,
    onSuccess: () => {
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
