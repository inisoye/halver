import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { BillCreate as BillCreateSchema } from '@/lib/zod';

export type BillCreatePayload = z.infer<typeof BillCreateSchema>;

export const createBill = async (billCreateDto: BillCreatePayload) => {
  const response = await apiClient.post<void>('/bills/', billCreateDto);
  return response.data;
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
