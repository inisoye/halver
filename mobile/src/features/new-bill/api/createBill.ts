import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { BillCreate as BillCreateSchema } from '@/lib/zod';

export type BillCreatePayload = z.infer<typeof BillCreateSchema>;

export interface BillCreationResponse {
  created: string;
  modified: string;
  name: string;
  uuid: string;
}

export const createBill = async (billCreateDto: BillCreatePayload) => {
  const response = await apiClient.post('/bills/', billCreateDto);
  return response.data as BillCreationResponse;
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getBills });
    },
  });
};
