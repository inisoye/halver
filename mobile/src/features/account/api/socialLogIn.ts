import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { SocialLogin as SocialLoginSchema, Token as TokenSchema } from '@/lib/zod';

export type SocialLoginPayload = z.infer<typeof SocialLoginSchema>;

export const postSocialLogIn = async (lotteryPaymentDto: SocialLoginPayload) => {
  const response = await apiClient.post('/api/v1/dj-rest-auth/google/', lotteryPaymentDto);
  return TokenSchema.parse(response);
};

export const usePostSocialLogin = () => {
  return useMutation({
    mutationFn: postSocialLogIn,
  });
};
