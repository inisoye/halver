import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { SocialLogin as SocialLoginSchema, Token as TokenSchema } from '@/lib/zod';

export type SocialLoginPayload = z.infer<typeof SocialLoginSchema>;

export const postSocialLogIn = async (lotteryPaymentDto: SocialLoginPayload) => {
  const response = await apiClient.post('/api/v1/dj-rest-auth/google/', lotteryPaymentDto, {
    headers: {
      Cookie: '', // Hack prevent CSRF token and other cookies from being sent with this request and causing errors
    },
  });

  return TokenSchema.parse(response.data);
};

export const usePostSocialLogin = () => {
  return useMutation({
    mutationFn: postSocialLogIn,
  });
};
