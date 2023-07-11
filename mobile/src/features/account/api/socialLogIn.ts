import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { tokenlessApiClient } from '@/lib/axios';
import { SocialLogin as SocialLoginSchema, Token as TokenSchema } from '@/lib/zod';

export type SocialLoginPayload = z.infer<typeof SocialLoginSchema>;

export const postSocialLogIn = async (lotteryPaymentDto: SocialLoginPayload) => {
  const response = await tokenlessApiClient.post(
    '/dj-rest-auth/google/',
    lotteryPaymentDto,
  );
  return TokenSchema.parse(response.data);
};

export const usePostSocialLogin = () => {
  return useMutation({
    mutationFn: postSocialLogIn,
  });
};
