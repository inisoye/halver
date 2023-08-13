import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { TransferRecipientCreate as TransferRecipientCreateSchema } from '@/lib/zod';

export type TransferRecipientCreatePayload = z.infer<
  typeof TransferRecipientCreateSchema
>;

export const createTransferRecipient = async (
  transferRecipientCreateDto: TransferRecipientCreatePayload,
) => {
  const response = await apiClient.post<void>(
    '/financials/transfer-recipients/',
    transferRecipientCreateDto,
  );
  return response.data;
};

export const useCreateTransferRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransferRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getUserDetails });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getTransferRecipients,
      });
    },
  });
};
