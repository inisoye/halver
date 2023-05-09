import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import {
  PaystackAccountNumberDetails as AccountDetailsSchema,
  PaystackAccountNumberCheck as PaystackAccountNumberCheckSchema,
} from '@/lib/zod';

export type AccountDetailsPayload = z.infer<typeof PaystackAccountNumberCheckSchema>;

export const validateAccountDetails = async (validateAccountDetailsDto: AccountDetailsPayload) => {
  const response = await apiClient.post(
    '/api/v1/financials/bank-details/',
    validateAccountDetailsDto,
  );
  return AccountDetailsSchema.parse(response.data);
};

export const useValidateAccountDetails = () => {
  return useMutation({
    mutationFn: validateAccountDetails,
  });
};
