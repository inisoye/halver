import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { BillCreate as BillCreateSchema } from '@/lib/zod';

export type BillCreatePayload = z.infer<typeof BillCreateSchema>;

export const createBill = async (billCreateDto: BillCreatePayload) => {
  const response = await apiClient.post<void>('/bills/', billCreateDto);
  return response.data;
};

export const useCreateBill = () => {
  return useMutation({
    mutationFn: createBill,
  });
};
