import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { TransferRecipientList as TransferRecipientsListSchema } from '@/lib/zod';

export type TransferRecipientsList = z.infer<typeof TransferRecipientsListSchema>;

export const getTransferRecipients = async () => {
  const response = await apiClient.get<TransferRecipientsList>(
    '/financials/transfer-recipients/',
  );
  return response.data; // Not parsed as it can be a large dataset.
};

export const useTransferRecipients = () => {
  return useQuery({
    queryKey: allStaticQueryKeys.getTransferRecipients,
    queryFn: getTransferRecipients,
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });
};
