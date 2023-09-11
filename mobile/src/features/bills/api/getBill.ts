import { useQuery, type QueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import {
  BillCreatorCreditorParticipant as BillCreatorCreditorParticipantSchema,
  BillDetail as BillDetailSchema,
} from '@/lib/zod';

export type BillDetailItem = z.infer<typeof BillDetailSchema>;
export type BillCreatorCreditorParticipant = z.infer<
  typeof BillCreatorCreditorParticipantSchema
>;

export const getBill = async (id: string) => {
  const response = await apiClient.get(`/bills/${id}/`);
  return response.data as BillDetailItem;
};

export const useBill = (id: string) => {
  return useQuery({
    queryKey: [...allStaticQueryKeys.getBill, id],
    queryFn: () => getBill(id),
  });
};

export const prefetchBill = async (queryClient: QueryClient, id: string) => {
  await queryClient.prefetchQuery({
    queryKey: [...allStaticQueryKeys.getBill, id],
    queryFn: () => getBill(id),
  });
};
