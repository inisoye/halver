import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { TransferRecipientCreate as TransferRecipientCreateSchema } from '@/lib/zod';

export type TransferRecipientCreatePayload = z.infer<
  typeof TransferRecipientCreateSchema
>;

export const createTransferRecipient = async (
  transferRecipientCreateDto: TransferRecipientCreatePayload,
) => {
  const response = await apiClient.post<void>(
    '/api/v1/financials/transfer-recipients/',
    transferRecipientCreateDto,
  );
  return response.data;
};

export const useCreateTransferRecipient = () => {
  return useMutation({
    mutationFn: createTransferRecipient,
  });
};
